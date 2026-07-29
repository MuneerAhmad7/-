import os
import shutil

brain_dir = r"C:\Users\Muneer Ahmad\.gemini\antigravity\brain\a0efb324-8d95-410f-a869-d453a688eada"
base_dir = r"C:\Users\Muneer Ahmad\.gemini\antigravity\scratch\madrassadarulfalah\images"

files_to_copy = [
    # Logo
    (os.path.join(brain_dir, "madrassa_logo_1785236582637.jpg"), os.path.join(base_dir, "logo.png")),
    
    # Hero
    (os.path.join(brain_dir, "madrassa_hero_bg_1785236595351.jpg"), os.path.join(base_dir, "hero", "hero-bg.jpg")),
    (os.path.join(brain_dir, "madrassa_hero_bg_1785236595351.jpg"), os.path.join(base_dir, "hero", "campus-banner.jpg")),
    
    # Programs
    (os.path.join(brain_dir, "hifz_quran_img_1785236711377.jpg"), os.path.join(base_dir, "programs", "hifz.jpg")),
    (os.path.join(brain_dir, "schooling_img_1785236730214.jpg"), os.path.join(base_dir, "programs", "schooling.jpg")),
    (os.path.join(brain_dir, "hifz_quran_img_1785236711377.jpg"), os.path.join(base_dir, "programs", "dars-e-nizami.jpg")),
    (os.path.join(brain_dir, "hifz_quran_img_1785236711377.jpg"), os.path.join(base_dir, "programs", "darul-ifta.jpg")),
    
    # Facilities
    (os.path.join(brain_dir, "cctv_facility_img_1785236751870.jpg"), os.path.join(base_dir, "facilities", "cctv.jpg")),
    (os.path.join(brain_dir, "madrassa_hero_bg_1785236595351.jpg"), os.path.join(base_dir, "facilities", "hostel.jpg")),
    (os.path.join(brain_dir, "madrassa_hero_bg_1785236595351.jpg"), os.path.join(base_dir, "facilities", "dining.jpg")),
    (os.path.join(brain_dir, "hifz_quran_img_1785236711377.jpg"), os.path.join(base_dir, "facilities", "library.jpg")),
    
    # Leadership
    (os.path.join(brain_dir, "madrassa_logo_1785236582637.jpg"), os.path.join(base_dir, "leadership", "mohtamim.jpg")),
    
    # Gallery
    (os.path.join(brain_dir, "madrassa_hero_bg_1785236595351.jpg"), os.path.join(base_dir, "gallery", "event1.jpg")),
    (os.path.join(brain_dir, "schooling_img_1785236730214.jpg"), os.path.join(base_dir, "gallery", "event2.jpg")),
    (os.path.join(brain_dir, "madrassa_hero_bg_1785236595351.jpg"), os.path.join(base_dir, "gallery", "campus1.jpg")),
    (os.path.join(brain_dir, "hifz_quran_img_1785236711377.jpg"), os.path.join(base_dir, "gallery", "campus2.jpg")),
]

for src, dst in files_to_copy:
    os.makedirs(os.path.dirname(dst), exist_ok=True)
    if os.path.exists(src):
        shutil.copy(src, dst)
        print(f"Copied {os.path.basename(src)} -> {dst}")
    else:
        print(f"Warning: Source not found: {src}")

print("Image setup completed successfully!")
