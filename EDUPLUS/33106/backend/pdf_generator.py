import io
from datetime import datetime
from reportlab.lib.pagesizes import letter
from reportlab.lib import colors
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.platypus import (
    SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, KeepTogether, HRFlowable
)

NAVY = colors.HexColor("#0F172A")
TEAL = colors.HexColor("#0D9488")
SLATE = colors.HexColor("#475569")
LIGHT_BG = colors.HexColor("#F8FAFC")
BORDER_COLOR = colors.HexColor("#E2E8F0")

def build_student_pdf(student_data: dict, institution_name: str = "Apex Academy of Sciences, Kurnool (AP)") -> bytes:
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
        fontSize=18,
        leading=22,
        textColor=NAVY
    )
    subtitle_style = ParagraphStyle(
        'DocSub',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=10,
        leading=14,
        textColor=TEAL
    )
    section_style = ParagraphStyle(
        'DocSec',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=12,
        leading=16,
        textColor=NAVY,
        spaceBefore=10,
        spaceAfter=6
    )
    body_style = ParagraphStyle(
        'DocBody',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=9,
        leading=13,
        textColor=SLATE
    )
    cell_style = ParagraphStyle(
        'TableCell',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=8,
        leading=11,
        textColor=NAVY
    )
    cell_bold = ParagraphStyle(
        'TableCellBold',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=8,
        leading=11,
        textColor=NAVY
    )

    story = []

    # Institution Header
    story.append(Paragraph(institution_name.upper(), subtitle_style))
    story.append(Paragraph("EduPulse — Student Diagnostic & Learning Plan", title_style))
    story.append(Paragraph(f"“Every test should lead to a better next step.” • Generated on {datetime.now().strftime('%d %b %Y, %I:%M %p')}", body_style))
    story.append(Spacer(1, 10))
    story.append(HRFlowable(width="100%", thickness=1.5, color=TEAL, spaceBefore=2, spaceAfter=10))

    # Student Info Grid
    info_data = [
        [
            Paragraph("<b>Student Name:</b>", cell_style), Paragraph(student_data.get('full_name', 'N/A'), cell_bold),
            Paragraph("<b>Student UID:</b>", cell_style), Paragraph(student_data.get('student_uid', 'N/A'), cell_bold)
        ],
        [
            Paragraph("<b>Batch:</b>", cell_style), Paragraph(student_data.get('batch_name', 'N/A'), cell_bold),
            Paragraph("<b>Roll Number:</b>", cell_style), Paragraph(student_data.get('roll_number', 'N/A'), cell_bold)
        ],
        [
            Paragraph("<b>Overall Average:</b>", cell_style), Paragraph(f"{student_data.get('overall_avg_pct', 0)}%", cell_bold),
            Paragraph("<b>Learning Status:</b>", cell_style), Paragraph(student_data.get('support_status', 'On Track').replace('_', ' ').title(), cell_bold)
        ]
    ]
    info_table = Table(info_data, colWidths=[100, 170, 100, 170])
    info_table.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,-1), LIGHT_BG),
        ('BOX', (0,0), (-1,-1), 1, BORDER_COLOR),
        ('INNERGRID', (0,0), (-1,-1), 0.5, BORDER_COLOR),
        ('TOPPADDING', (0,0), (-1,-1), 6),
        ('BOTTOMPADDING', (0,0), (-1,-1), 6),
    ]))
    story.append(info_table)
    story.append(Spacer(1, 14))

    # Subject Performance Summary
    story.append(Paragraph("Subject Mastery Breakdown", section_style))
    subj_data = [[
        Paragraph("Subject", cell_bold),
        Paragraph("Assessments", cell_bold),
        Paragraph("Average Score %", cell_bold),
        Paragraph("Status Indicator", cell_bold)
    ]]
    for sb in student_data.get('subject_breakdown', []):
        avg = sb.get('avg_pct', 0)
        status_text = "Demonstrating Mastery" if avg >= 70 else ("Progressing Well" if avg >= 50 else "Opportunity for Practice")
        subj_data.append([
            Paragraph(sb.get('subject_name', ''), cell_style),
            Paragraph(str(sb.get('test_count', 0)), cell_style),
            Paragraph(f"{avg}%", cell_bold),
            Paragraph(status_text, cell_style)
        ])
    subj_table = Table(subj_data, colWidths=[150, 100, 120, 170])
    subj_table.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,0), colors.HexColor("#EEF2F6")),
        ('GRID', (0,0), (-1,-1), 0.5, BORDER_COLOR),
        ('TOPPADDING', (0,0), (-1,-1), 5),
        ('BOTTOMPADDING', (0,0), (-1,-1), 5),
    ]))
    story.append(subj_table)
    story.append(Spacer(1, 14))

    # Improvement Opportunities (Neutral Educational Terminology)
    story.append(Paragraph("Targeted Practice Recommendations (Priority Focus Areas)", section_style))
    practice_data = [[
        Paragraph("Topic", cell_bold),
        Paragraph("Subject", cell_bold),
        Paragraph("Topic Avg %", cell_bold),
        Paragraph("Recommended Next Step", cell_bold)
    ]]
    needs = student_data.get('topic_needs_practice', [])
    if needs:
        for t in needs:
            practice_data.append([
                Paragraph(t.get('topic_name', ''), cell_style),
                Paragraph(t.get('subject_name', ''), cell_style),
                Paragraph(f"{t.get('avg_pct', 0)}%", cell_bold),
                Paragraph("Targeted worksheet & concept clinic session", cell_style)
            ])
    else:
        practice_data.append([
            Paragraph("All assessed topics meet or exceed the standard benchmark.", cell_style),
            Paragraph("-", cell_style), Paragraph("-", cell_style), Paragraph("Advance to higher-order problem sets.", cell_style)
        ])
    prac_table = Table(practice_data, colWidths=[160, 110, 90, 180])
    prac_table.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,0), colors.HexColor("#FEF2F2")),
        ('GRID', (0,0), (-1,-1), 0.5, BORDER_COLOR),
        ('TOPPADDING', (0,0), (-1,-1), 5),
        ('BOTTOMPADDING', (0,0), (-1,-1), 5),
    ]))
    story.append(prac_table)
    story.append(Spacer(1, 14))

    # Completed Interventions & Follow-up Results
    story.append(Paragraph("Intervention Follow-up & Observed Changes", section_style))
    interv_data = [[
        Paragraph("Intervention Topic", cell_bold),
        Paragraph("Type", cell_bold),
        Paragraph("Baseline %", cell_bold),
        Paragraph("Follow-up %", cell_bold),
        Paragraph("Observed Delta", cell_bold),
        Paragraph("Status", cell_bold)
    ]]
    evals = student_data.get('intervention_outcomes', [])
    if evals:
        for ev in evals:
            delta = ev.get('delta_pct')
            delta_str = f"+{delta}%" if (delta is not None and delta > 0) else f"{delta}%" if delta is not None else "Pending"
            interv_data.append([
                Paragraph(ev.get('topic_name', 'General'), cell_style),
                Paragraph(ev.get('action_type', '').replace('_', ' ').title(), cell_style),
                Paragraph(f"{ev.get('baseline_score_pct', 0)}%", cell_style),
                Paragraph(f"{ev.get('follow_up_score_pct', 'N/A')}%" if ev.get('follow_up_score_pct') is not None else "Pending", cell_style),
                Paragraph(delta_str, cell_bold),
                Paragraph(ev.get('outcome_status', '').replace('_', ' ').title(), cell_style)
            ])
    else:
        interv_data.append([
            Paragraph("No active interventions logged.", cell_style),
            Paragraph("-", cell_style), Paragraph("-", cell_style), Paragraph("-", cell_style), Paragraph("-", cell_style), Paragraph("Standard Tracking", cell_style)
        ])
    int_table = Table(interv_data, colWidths=[120, 100, 75, 75, 80, 90])
    int_table.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,0), colors.HexColor("#F0FDF4")),
        ('GRID', (0,0), (-1,-1), 0.5, BORDER_COLOR),
        ('TOPPADDING', (0,0), (-1,-1), 5),
        ('BOTTOMPADDING', (0,0), (-1,-1), 5),
    ]))
    story.append(int_table)

    # Disclaimer note
    story.append(Spacer(1, 12))
    disclaimer = (
        "<b>Educational Note:</b> Observed score changes indicate assessment progression following instructional support. "
        "EduPulse maintains that each student learns through continuous deliberate practice rather than fixed labels."
    )
    story.append(Paragraph(disclaimer, body_style))

    # Sign-off block
    story.append(Spacer(1, 20))
    sig_data = [
        [Paragraph("<b>Faculty Mentor</b><br/><br/>______________________", cell_style),
         Paragraph("<b>Academic Coordinator</b><br/><br/>______________________", cell_style),
         Paragraph(f"<b>Apex Academy Seal</b><br/><br/>Kurnool, AP", cell_style)]
    ]
    sig_table = Table(sig_data, colWidths=[180, 180, 180])
    sig_table.setStyle(TableStyle([('ALIGN', (0,0), (-1,-1), 'CENTER')]))
    story.append(sig_table)

    doc.build(story)
    buffer.seek(0)
    return buffer.getvalue()

def build_batch_audit_pdf(batch_name: str, gap_records: list, stats: dict, institution_name: str = "Apex Academy of Sciences, Kurnool (AP)") -> bytes:
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

    title_style = ParagraphStyle('DocTitle', parent=styles['Normal'], fontName='Helvetica-Bold', fontSize=18, leading=22, textColor=NAVY)
    subtitle_style = ParagraphStyle('DocSub', parent=styles['Normal'], fontName='Helvetica', fontSize=10, leading=14, textColor=TEAL)
    section_style = ParagraphStyle('DocSec', parent=styles['Normal'], fontName='Helvetica-Bold', fontSize=12, leading=16, textColor=NAVY, spaceBefore=10, spaceAfter=6)
    body_style = ParagraphStyle('DocBody', parent=styles['Normal'], fontName='Helvetica', fontSize=9, leading=13, textColor=SLATE)
    cell_style = ParagraphStyle('TableCell', parent=styles['Normal'], fontName='Helvetica', fontSize=8, leading=11, textColor=NAVY)
    cell_bold = ParagraphStyle('TableCellBold', parent=styles['Normal'], fontName='Helvetica-Bold', fontSize=8, leading=11, textColor=NAVY)

    story = []
    story.append(Paragraph(institution_name.upper(), subtitle_style))
    story.append(Paragraph(f"Batch Performance & Topic Gap Audit: {batch_name}", title_style))
    story.append(Paragraph(f"Generated for Academic Coordinators • {datetime.now().strftime('%d %b %Y, %I:%M %p')}", body_style))
    story.append(HRFlowable(width="100%", thickness=1.5, color=TEAL, spaceBefore=4, spaceAfter=12))

    # Summary metrics
    stat_data = [
        [
            Paragraph("<b>Total Enrolled:</b>", cell_style), Paragraph(str(stats.get('total_students', 0)), cell_bold),
            Paragraph("<b>Tests Analyzed:</b>", cell_style), Paragraph(str(stats.get('total_tests', 0)), cell_bold)
        ],
        [
            Paragraph("<b>Batch Average:</b>", cell_style), Paragraph(f"{stats.get('batch_avg', 0)}%", cell_bold),
            Paragraph("<b>Flagged Topic Gaps:</b>", cell_style), Paragraph(str(len(gap_records)), cell_bold)
        ]
    ]
    stat_table = Table(stat_data, colWidths=[120, 150, 120, 150])
    stat_table.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,-1), LIGHT_BG),
        ('GRID', (0,0), (-1,-1), 0.5, BORDER_COLOR),
        ('PADDING', (0,0), (-1,-1), 6)
    ]))
    story.append(stat_table)
    story.append(Spacer(1, 14))

    # Topic Gaps Table
    story.append(Paragraph("Identified Priority Learning Topics (Actionable Rule Triggers)", section_style))
    table_data = [[
        Paragraph("Subject", cell_bold),
        Paragraph("Topic", cell_bold),
        Paragraph("Batch Avg %", cell_bold),
        Paragraph("Students Impacted", cell_bold),
        Paragraph("Pattern", cell_bold),
        Paragraph("Recommended Teacher Action", cell_bold)
    ]]

    for g in gap_records:
        pattern = "Recurring Gap" if g.get('is_recurring') else "Preliminary Gap"
        table_data.append([
            Paragraph(g.get('subject_name', ''), cell_style),
            Paragraph(g.get('topic_name', ''), cell_bold),
            Paragraph(f"{g.get('avg_score_pct', 0)}%", cell_style),
            Paragraph(f"{g.get('students_impacted', 0)} ({g.get('impact_percentage', 0)}%)", cell_style),
            Paragraph(pattern, cell_style),
            Paragraph(g.get('recommended_action_type', '').replace('_', ' ').title(), cell_style)
        ])

    table = Table(table_data, colWidths=[80, 120, 70, 90, 80, 100])
    table.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,0), colors.HexColor("#EEF2F6")),
        ('GRID', (0,0), (-1,-1), 0.5, BORDER_COLOR),
        ('PADDING', (0,0), (-1,-1), 5)
    ]))
    story.append(table)

    story.append(Spacer(1, 14))
    story.append(Paragraph("<b>Action Plan:</b> Academic Coordinator will review teacher intervention scheduling for recurring topics during the weekly faculty coordination meeting.", body_style))

    doc.build(story)
    buffer.seek(0)
    return buffer.getvalue()
