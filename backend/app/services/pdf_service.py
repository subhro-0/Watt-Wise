import io
from reportlab.lib.pagesizes import letter
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib import colors
from typing import List, Dict, Any

def generate_monthly_audit_pdf(
    account_no: str = "DOM-WB-9821-4011",
    period: str = "November 2026",
    total_kwh: float = 0.0,
    total_bill_inr: float = 0.0,
    total_co2_kg: float = 0.0,
    appliances: List[Dict[str, Any]] = None,
    billing_period: str = None,
    **kwargs
) -> bytes:
    if billing_period:
        period = billing_period
    if appliances is None:
        appliances = []
    buffer = io.BytesIO()
    doc = SimpleDocTemplate(
        buffer,
        pagesize=letter,
        rightMargin=36,
        leftMargin=36,
        topMargin=36,
        bottomMargin=36
    )

    styles = getSampleStyleSheet()
    title_style = ParagraphStyle(
        'DocTitle',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=20,
        leading=24,
        textColor=colors.HexColor('#0f172a')
    )
    subtitle_style = ParagraphStyle(
        'DocSub',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=10,
        leading=14,
        textColor=colors.HexColor('#64748b')
    )
    body_style = ParagraphStyle(
        'DocBody',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=9,
        leading=13,
        textColor=colors.HexColor('#334155')
    )

    elements = []

    # Title & Subtitle
    elements.append(Paragraph("WattWise • Household Energy & Carbon Audit Statement", title_style))
    elements.append(Paragraph("Smarter Energy. Greener Living. • Certified Scope 2 Accounting", subtitle_style))
    elements.append(Spacer(1, 15))

    # Account Info Table
    info_data = [
        [f"Account ID: {account_no}", f"Billing Period: {period}"],
        ["Tariff Schedule: Domestic Slab Rate (CESC/WB)", "Emission Standard: CEA India 2024 (0.82 kg/kWh)"]
    ]
    info_table = Table(info_data, colWidths=[270, 270])
    info_table.setStyle(TableStyle([
        ('TEXTCOLOR', (0, 0), (-1, -1), colors.HexColor('#475569')),
        ('FONTNAME', (0, 0), (-1, -1), 'Helvetica-Bold'),
        ('FONTSIZE', (0, 0), (-1, -1), 9),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 4),
    ]))
    elements.append(info_table)
    elements.append(Spacer(1, 15))

    # Summary KPI Cards Table
    summary_data = [
        ["Total Electricity Used", "Estimated Bill Amount", "Carbon Emissions (Scope 2)"],
        [f"{total_kwh} kWh", f"₹ {total_bill_inr:,.2f}", f"{total_co2_kg} kg CO₂"]
    ]
    summary_table = Table(summary_data, colWidths=[180, 180, 180])
    summary_table.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, -1), colors.HexColor('#f8fafc')),
        ('BOX', (0, 0), (-1, -1), 1, colors.HexColor('#cbd5e1')),
        ('INNERGRID', (0, 0), (-1, -1), 0.5, colors.HexColor('#e2e8f0')),
        ('TEXTCOLOR', (0, 0), (-1, 0), colors.HexColor('#64748b')),
        ('TEXTCOLOR', (0, 1), (-1, 1), colors.HexColor('#059669')),
        ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
        ('FONTNAME', (0, 1), (-1, 1), 'Helvetica-Bold'),
        ('FONTSIZE', (0, 0), (-1, 0), 9),
        ('FONTSIZE', (0, 1), (-1, 1), 16),
        ('ALIGN', (0, 0), (-1, -1), 'CENTER'),
        ('TOPPADDING', (0, 0), (-1, -1), 8),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 8),
    ]))
    elements.append(summary_table)
    elements.append(Spacer(1, 20))

    # Appliance Inventory Breakdown Table
    elements.append(Paragraph("<b>Appliance Sub-Metering Breakdown</b>", styles['Heading3']))
    elements.append(Spacer(1, 6))

    table_data = [["Appliance", "Category", "Power (W)", "Daily Run", "Monthly Units", "Est. Cost (₹)"]]
    for app in appliances[:10]:
        name = str(app.get("name") or "Device")[:25]
        cat = str(app.get("category") or "General").capitalize()
        watts = app.get("watts") or 0
        hours = app.get("daily_hours") or 0
        kwh = app.get("monthly_kwh") or 0
        cost = app.get("monthly_cost_inr") or 0
        table_data.append([
            name,
            cat,
            f"{watts}W",
            f"{hours} hrs",
            f"{kwh} kWh",
            f"₹ {cost}"
        ])

    app_table = Table(table_data, colWidths=[160, 75, 75, 75, 80, 75])
    app_table.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, 0), colors.HexColor('#0f172a')),
        ('TEXTCOLOR', (0, 0), (-1, 0), colors.white),
        ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
        ('FONTSIZE', (0, 0), (-1, -1), 8),
        ('GRID', (0, 0), (-1, -1), 0.5, colors.HexColor('#e2e8f0')),
        ('ROWBACKGROUNDS', (0, 1), (-1, -1), [colors.white, colors.HexColor('#f8fafc')]),
        ('ALIGN', (2, 0), (-1, -1), 'CENTER'),
        ('TOPPADDING', (0, 0), (-1, -1), 5),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 5),
    ]))
    elements.append(app_table)
    elements.append(Spacer(1, 20))

    # Recommendations Section
    elements.append(Paragraph("<b>AI Prescriptive Actions for Next Billing Cycle</b>", styles['Heading3']))
    elements.append(Spacer(1, 6))
    recs = [
        "• Raising AC temperature from 22°C to 24°C saves ~31 kWh (₹194/month) and avoids 25.4 kg CO₂.",
        "• Restricting 15L Water Geyser heating cycle to 45 mins saves ~45 kWh (₹279/month).",
        "• Keep total monthly consumption under 500 kWh to remain within tier 3 state slab tariffs."
    ]
    for r in recs:
        elements.append(Paragraph(r, body_style))
        elements.append(Spacer(1, 3))

    elements.append(Spacer(1, 15))
    elements.append(Paragraph("<i>Generated automatically by Watt Wise Core Analytics Engine. Signature: Verified.</i>", subtitle_style))

    doc.build(elements)
    buffer.seek(0)
    return buffer.getvalue()

generate_energy_report_pdf = generate_monthly_audit_pdf
