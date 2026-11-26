import json
import os
from pathlib import Path
from urllib.parse import urljoin
from playwright.sync_api import sync_playwright

root = Path(__file__).resolve().parents[1]
shots = root / "qa/screenshots"
shots.mkdir(parents=True, exist_ok=True)
results = []
failures = []
base = os.environ.get("TWEL_QA_URL", "http://127.0.0.1:5173").rstrip("/")


def assert_in_viewport(locator, width, height):
    box = locator.bounding_box()
    assert box is not None, f"{locator} is hidden at {width} x {height}"
    assert box["x"] >= 0 and box["x"] + box["width"] <= width, (locator, box, width)
    assert box["y"] >= 0 and box["y"] + box["height"] <= height, (locator, box, height)


with sync_playwright() as p:
    browser = p.chromium.launch(headless=True)
    standard_viewports = [(360, 640), (768, 1024), (1280, 720)]
    compact_viewports = [(320, 480), (667, 375), (1366, 620)]
    for route in ("", "city", "studio", "signal"):
        is_city = route in ("", "city")
        viewports = standard_viewports + compact_viewports if is_city else standard_viewports
        for width, height in viewports:
            page = browser.new_page(viewport={"width": width, "height": height}, device_scale_factor=1)
            errors = []
            page.on("pageerror", lambda error: errors.append(str(error)))
            page.on("console", lambda message: errors.append(message.text) if message.type == "error" else None)
            response = page.goto(base + "/" + route + ("/" if route else ""), wait_until="networkidle")
            page.evaluate("document.fonts.ready")
            page.locator("img").evaluate_all("(images) => images.forEach(i => i.loading = 'eager')")
            page.wait_for_function("Array.from(document.images).every(i => i.complete)")
            assert response.status == 200
            assert page.locator("h1").count() == 1
            assert page.locator("img").evaluate_all("(images) => images.every(i => i.naturalWidth > 0)"), "broken image"
            dimensions = page.evaluate("({viewport:innerWidth, body:document.documentElement.scrollWidth})")
            if dimensions["body"] > width + 1:
                failures.append(f"{route or 'home'} {width} x {height}: overflow {dimensions}")
            nav = page.get_by_role("navigation", name="Nawigacja główna")
            screens = nav.get_by_role("link", name="Ekrany LED")
            catalog = nav.get_by_role("link", name="Katalog")
            assert_in_viewport(screens, width, height)
            assert_in_viewport(catalog, width, height)
            if is_city:
                hero = page.locator("#top")
                quote = hero.get_by_role("link", name="Wyceń projekt")
                video_control = hero.get_by_role("button", name="wideo", exact=False)
                assert_in_viewport(quote, width, height)
                assert_in_viewport(video_control, width, height)
            if width == 360:
                catalog.press("Enter")
                page.wait_for_url("**/katalog/")
                assert page.get_by_role("heading", name="Katalog ekranów LED", exact=True).is_visible()
                page.go_back(wait_until="load")
                screens.press("Enter")
                assert page.url.endswith("#oferta")
                assert page.locator("#oferta h2").bounding_box()["y"] < height
                if is_city:
                    quote.focus()
                    quote.press("Enter")
                    assert page.url.endswith("#kontakt")
                    assert page.locator("#kontakt h2").bounding_box()["y"] < height
                    hero.get_by_role("link", name="Zastosowania").click()
                    assert page.url.endswith("#zastosowania")
                page.evaluate("scrollTo(0,0)")
            if route:
                assert page.locator("table").count() == 0
                for anchor in ("oferta", "zastosowania", "katalog", "kontakt"):
                    assert page.locator("#" + anchor).count() == 1
                assert page.locator(".monitor-panel .screen-brand").all_text_contents() == ["twel.pl"] * 4
                if width == 1280:
                    first = page.locator("details").first
                    first.locator("summary").click()
                    assert first.get_attribute("open") is not None
                    first.locator("summary").click()
                    form = page.locator("form")
                    form.get_by_label("Imię i firma").fill("Testowa firma")
                    form.get_by_label("E-mail").fill("test@example.com")
                    form.get_by_label("Co Cię interesuje?").select_option(label="Poster LED")
                    form.get_by_label("Opowiedz o projekcie").fill("Poster do witryny, około 1 x 2 m.")
                    outbound = []
                    page.on("request", lambda req: outbound.append(req.method) if req.method == "POST" else None)
                    with page.expect_download() as download:
                        form.get_by_role("button", name="Zapisz zapytanie").click()
                    downloaded = download.value
                    text = Path(downloaded.path()).read_text(encoding="utf-8")
                    assert "test@example.com" in text and "Poster LED" in text
                    assert not outbound, "Static form unexpectedly sent a request"
                    assert "nie zostały wysłane" in page.get_by_role("status").inner_text()
                    form.get_by_label("Imię i firma").fill("")
                    form.get_by_label("E-mail").fill("")
                    form.get_by_label("Opowiedz o projekcie").fill("")
                    form.get_by_label("Co Cię interesuje?").select_option(index=0)
                page.keyboard.press("Control+Home")
                page.evaluate("scrollTo(0,0)")
            page.evaluate("document.activeElement.blur()")
            page.screenshot(path=str(shots / f"{route or 'home'}-{width}.jpg"), full_page=width in (360, 768, 1280), type="jpeg", quality=82)
            if errors:
                failures.extend(errors)
            results.append({"page": route or "home", "width": width, "height": height, "overflow": dimensions["body"] > width + 1, "runtime_errors": errors})
            page.close()
    request = browser.new_context().request
    pdf = request.get(base + "/documents/TWEL_Katalog.pdf")
    assert pdf.status == 200 and pdf.body().startswith(b"%PDF")
    assert pdf.headers["content-type"].startswith("application/pdf")
    for width, height in standard_viewports + compact_viewports:
        page = browser.new_page(viewport={"width": width, "height": height})
        errors = []
        page.on("pageerror", lambda error: errors.append(str(error)))
        page.on("console", lambda message: errors.append(message.text) if message.type == "error" else None)
        assert page.goto(base + "/katalog/", wait_until="load").ok
        page.evaluate("document.fonts.ready")
        assert page.get_by_role("heading", level=1, name="Katalog ekranów LED").is_visible()
        assert page.get_by_role("link", name="Katalog", exact=True).get_attribute("aria-current") == "page"
        pdf_download = page.get_by_role("link", name="Pobierz PDF")
        pdf_preview = page.get_by_role("link", name="Otwórz PDF")
        assert_in_viewport(pdf_download, width, height)
        assert_in_viewport(pdf_preview, width, height)
        assert urljoin(base + "/", pdf_preview.get_attribute("href")) == pdf.url
        overflow = page.evaluate("document.documentElement.scrollWidth > innerWidth")
        assert not overflow, f"catalog overflows at {width} x {height}"
        page.screenshot(path=str(shots / f"catalog-{width}.jpg"), type="jpeg", quality=87)
        if width == 360:
            with page.expect_download() as downloading:
                pdf_download.press("Enter")
            downloaded_pdf = downloading.value
            assert downloaded_pdf.suggested_filename == "TWEL_Katalog.pdf"
            assert Path(downloaded_pdf.path()).read_bytes() == pdf.body()
            index = page.get_by_role("navigation", name="Kategorie katalogu")
            index.get_by_role("link", name="Folie LED").press("Enter")
            assert page.url.endswith("#folie-led")
            assert_in_viewport(page.get_by_role("heading", name="Folie LED", exact=True), width, height)
            section = page.get_by_role("region", name="Folie LED")
            assert section.get_by_role("link").get_attribute("href").endswith("#page=7")
            page.get_by_role("link", name="Wyceń projekt").click()
            page.wait_for_url(base + "/#kontakt")
            assert page.locator("#kontakt form").is_visible()
        if errors:
            failures.extend(errors)
        results.append({"page": "katalog", "width": width, "height": height, "overflow": overflow, "runtime_errors": errors})
        page.close()
    browser.close()
report = {"results": results, "pdf": "200, valid PDF header and matching downloaded file", "failures": failures}
(root / "qa/browser-report.json").write_text(json.dumps(report, indent=2), encoding="utf-8")
print(json.dumps(report, indent=2))
if failures:
    raise SystemExit(1)
