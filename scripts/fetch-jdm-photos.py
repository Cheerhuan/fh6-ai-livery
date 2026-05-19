#!/usr/bin/env python3
"""
FH6 Daily JDM Photo Fetcher
━━━━━━━━━━━━━━━━━━━━━━━━━
Downloads 10 fresh JDM car photos daily from Pexels CDN.
Saves to assets/liveries/jdm-{1..10}.jpg.
Updates the gallery manifest so the FH6 site shows fresh images.

Pexels photos are CC0 / Free to use — no attribution required.
https://www.pexels.com/license/
"""

import random
import os
import json
import subprocess
import sys
from pathlib import Path
from datetime import datetime

# ─── Configuration ────────────────────────────────────
PROJECT_DIR = os.path.expanduser("~/fh6-ai-livery")
LIVERIES_DIR = os.path.join(PROJECT_DIR, "assets", "liveries")
COUNT = 10  # How many images to download daily
IMG_WIDTH = 800
IMG_HEIGHT = 450

# ─── Pexels Photo Pool ────────────────────────────────
# Each entry: (photo_id, description)
# Photos are from the "JDM Kuruma" collection and other verified CC0 sources
PHOTO_POOL = [
    # JDM Car Meet Collection (verified working)
    (30145516, "Dynamic JDM Car Meet with Iconic Supra"),
    (30145510, "JDM Car Meet Featuring Nissan Skyline and Honda Civic"),
    (30145523, "Classic Nissan Skyline R32 at Car Meet"),
    (30145515, "Vibrant JDM Car Gathering on a Sunny Day"),
    (30145512, "Lineup of Classic JDM Cars at Outdoor Car Meet"),
    (30145520, "Vibrant Car Meet with Various JDM Models"),
    (30145511, "Vibrant Car Meet with Iconic JDM Cars"),
    (30145525, "Vibrant JDM Car Meet Showcasing Modified Vehicles"),

    # Vintage Japanese Cars
    (37596946, "Vintage Car on a Busy Japanese Street"),
    (36816056, "Vintage Japanese Car on Tokyo Highway"),
    (31009810, "Close-Up of Classic Japanese Car in Urban Setting"),
    (24712860, "Nissan Gloria Classic Japanese Car"),
    (31164667, "Vintage Japanese Car by Traditional Shop"),
    (30460202, "Vintage Japanese Car in Parking Lot at Night"),
    (29306805, "Classic JDM Cars at Tokyo Meet"),

    # Iconic JDM Models
    (31618496, "Classic JDM Car Meet Featuring Iconic Toyota AE86"),
    (20727190, "Classic Japanese Sports Cars in Parking Lot on Rainy Night"),
    (25956941, "Selective Focus of Nissan Silvia S15 Car"),
    (33947923, "Nissan Skyline at Vibrant Car Show Event"),
    (31180431, "Dynamic Blue Toyota Supra at Dubai Car Meet"),
    (16418366, "Gray Nissan Silvia with Rocks Behind"),
    (18818883, "Front of Nissan Skyline Car"),
    (31853140, "Rear View of a Toyota Supra in Canada"),

    # Additional verified photos
    (28962879, "Tuned Modified Sports Car"),
]


def download_photo(photo_id, output_path):
    """Download a Pexels photo by ID to the given path."""
    url = (
        f"https://images.pexels.com/photos/{photo_id}/"
        f"pexels-photo-{photo_id}.jpeg"
        f"?auto=compress&cs=tinysrgb&w={IMG_WIDTH}&h={IMG_HEIGHT}&fit=crop"
    )
    cmd = [
        "curl", "-sL", "-o", output_path,
        "-H", "User-Agent: Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)",
        url
    ]
    result = subprocess.run(cmd, capture_output=True, timeout=30)

    # Check if it's actually a JPEG (not an error page)
    file_check = subprocess.run(
        ["file", output_path], capture_output=True, text=True, timeout=5
    )
    if "JPEG image data" not in file_check.stdout:
        os.remove(output_path)
        return False

    size = os.path.getsize(output_path)
    if size < 5000:  # Too small, likely placeholder
        os.remove(output_path)
        return False

    return True


def main():
    os.makedirs(LIVERIES_DIR, exist_ok=True)

    # Select 10 random photos (without repeats)
    selected = random.sample(PHOTO_POOL, min(COUNT, len(PHOTO_POOL)))

    results = []
    success_count = 0

    print(f"📷 FH6 Daily Photo Fetch — {datetime.now().strftime('%Y-%m-%d %H:%M')}")
    print(f"   Selecting {len(selected)} photos from pool of {len(PHOTO_POOL)}")
    print()

    for i, (photo_id, desc) in enumerate(selected, 1):
        filename = f"jdm-{i}.jpg"
        filepath = os.path.join(LIVERIES_DIR, filename)

        print(f"  [{i}/{len(selected)}] Downloading {photo_id}... ", end="", flush=True)

        success = download_photo(photo_id, filepath)
        if success:
            size_kb = os.path.getsize(filepath) / 1024
            print(f"✅ {size_kb:.0f}KB — {desc[:50]}")
            results.append({
                "file": filename,
                "photo_id": photo_id,
                "description": desc,
                "size_kb": round(size_kb, 0)
            })
            success_count += 1
        else:
            print(f"❌ Failed — {desc[:50]}")

    # Write manifest
    manifest = {
        "updated": datetime.now().isoformat(),
        "count": len(results),
        "images": results
    }
    manifest_path = os.path.join(LIVERIES_DIR, "manifest.json")
    with open(manifest_path, "w") as f:
        json.dump(manifest, f, indent=2, ensure_ascii=False)

    print()
    print(f"  ────────────────────────────────────────────")
    print(f"  ✅ Downloaded: {success_count}/{len(selected)}")
    print(f"  📄 Manifest:   assets/liveries/manifest.json")
    print(f"  📁 Directory:  {LIVERIES_DIR}")

    # Return exit code
    if success_count == 0:
        print("  ❌ ERROR: All downloads failed!")
        sys.exit(1)

    return 0


if __name__ == "__main__":
    main()
