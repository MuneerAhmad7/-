import os

# Create CSV sample file
csv_content = """Student Roll No,Student Name (Urdu),Father's Name (Urdu),Department,Examination Term,Obtained / Total Marks,Grade,Result Status
MDF-2026-1003,عمر فاروق,خالد محمود,تحفیظ القرآن والتجوید (Hifz-ul-Quran),Annual Examination 2026 / سالانہ امتحان ۲۰۲۶,950 / 1000,ممتاز (Excellent),کامیاب (Passed)
MDF-2026-1004,محمد اسامہ,طارق عزیز,عصری پرائمری و مڈل اسکولنگ (Schooling),Annual Examination 2026 / سالانہ امتحان ۲۰۲۶,920 / 1000,جید جداً (Very Good),کامیاب (Passed)
MDF-2026-1005,عبد الرحمن,فضلِ الٰہی,درسِ نظامی عالمیہ (Dars-e-Nizami),Annual Examination 2026 / سالانہ امتحان ۲۰۲۶,970 / 1000,ممتاز (Excellent),فارغ التحصیل حفاظ (Graduate Hafiz)
MDF-2026-1006,سعد سواتی,محمد ابراہیم,دارالافتاء و تخصص فی الفقہ (Darul Ifta),Annual Examination 2026 / سالانہ امتحان ۲۰۲۶,890 / 1000,جید (Good),کامیاب (Passed)
"""

csv_path = r"C:\Users\Muneer Ahmad\.gemini\antigravity\scratch\madrassadarulfalah\sample_results.csv"
with open(csv_path, "w", encoding="utf-8-sig") as f:
    f.write(csv_content)

print(f"Sample CSV created at {csv_path}")

try:
    import pandas as pd
    df = pd.read_csv(csv_path)
    excel_path = r"C:\Users\Muneer Ahmad\.gemini\antigravity\scratch\madrassadarulfalah\sample_results.xlsx"
    df.to_excel(excel_path, index=False)
    print(f"Sample Excel created at {excel_path}")
except Exception as e:
    print(f"Excel conversion note: {e}")
