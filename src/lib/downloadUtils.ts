/**
 * Download Utilities - CSV and PDF export functionality
 * 
 * This module provides client-side export functionality for data tables,
 * attendance records, reports, and other downloadable content.
 */

/**
 * Convert array of objects to CSV format
 */
export function arrayToCSV(data: any[], headers?: string[]): string {
  if (data.length === 0) return '';

  const actualHeaders = headers || Object.keys(data[0]);
  const csvHeaders = actualHeaders.join(',');
  
  const csvRows = data.map(row => {
    return actualHeaders.map(header => {
      const cell = row[header] ?? '';
      const cellStr = String(cell);
      // Escape quotes and wrap in quotes if contains comma or newline
      if (cellStr.includes(',') || cellStr.includes('"') || cellStr.includes('\n')) {
        return `"${cellStr.replace(/"/g, '""')}"`;
      }
      return cellStr;
    }).join(',');
  });

  return [csvHeaders, ...csvRows].join('\n');
}

/**
 * Download CSV file
 */
export function downloadCSV(data: any[], filename: string, headers?: string[]): void {
  const csv = arrayToCSV(data, headers);
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  
  link.setAttribute('href', url);
  link.setAttribute('download', `${filename}.csv`);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/**
 * Download attendance records as CSV
 */
export function downloadAttendanceCSV(attendanceData: any[], filename = 'attendance_report'): void {
  const formattedData = attendanceData.map(record => ({
    'Student Name': record.studentName || record.name,
    'Class': record.class,
    'Section': record.section,
    'Date': record.date ? new Date(record.date).toLocaleDateString() : '',
    'Status': record.status || record.present ? 'Present' : 'Absent',
    'Marked By': record.markedBy || 'Teacher',
    'Time': record.timestamp ? new Date(record.timestamp).toLocaleTimeString() : ''
  }));

  downloadCSV(formattedData, filename);
}

/**
 * Download student list as CSV
 */
export function downloadStudentListCSV(students: any[], filename = 'student_list'): void {
  const formattedData = students.map(student => ({
    'Name': student.name,
    'Student ID': student.id || student.studentId,
    'Class': student.class,
    'Section': student.section,
    'Email': student.email || '',
    'Phone': student.phone || student.contactNumber || '',
    'Enrollment Date': student.enrollmentDate ? new Date(student.enrollmentDate).toLocaleDateString() : ''
  }));

  downloadCSV(formattedData, filename);
}

/**
 * Download exam results as CSV
 */
export function downloadExamResultsCSV(results: any[], filename = 'exam_results'): void {
  const formattedData = results.map(result => ({
    'Student Name': result.studentName,
    'Student ID': result.studentId,
    'Subject': result.subject,
    'Marks Obtained': result.marksObtained,
    'Total Marks': result.totalMarks,
    'Percentage': result.percentage || ((result.marksObtained / result.totalMarks) * 100).toFixed(2) + '%',
    'Grade': result.grade || '',
    'Exam Date': result.examDate ? new Date(result.examDate).toLocaleDateString() : ''
  }));

  downloadCSV(formattedData, filename);
}

/**
 * Download fee records as CSV
 */
export function downloadFeeRecordsCSV(feeRecords: any[], filename = 'fee_records'): void {
  const formattedData = feeRecords.map(record => ({
    'Student Name': record.studentName,
    'Student ID': record.studentId,
    'Fee Type': record.feeType || 'Tuition',
    'Amount': record.amount,
    'Status': record.status || record.paid ? 'Paid' : 'Pending',
    'Payment Date': record.paymentDate ? new Date(record.paymentDate).toLocaleDateString() : '',
    'Due Date': record.dueDate ? new Date(record.dueDate).toLocaleDateString() : ''
  }));

  downloadCSV(formattedData, filename);
}

/**
 * Download JSON data as a file
 */
export function downloadJSON(data: any, filename: string): void {
  const json = JSON.stringify(data, null, 2);
  const blob = new Blob([json], { type: 'application/json;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  
  link.setAttribute('href', url);
  link.setAttribute('download', `${filename}.json`);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/**
 * Generate simple text-based PDF content (can be enhanced with jsPDF if needed)
 * For now, creates a formatted text file that can be printed as PDF
 */
export function downloadReportAsPDF(reportData: {
  title: string;
  date: string;
  content: string;
  footer?: string;
}, filename: string): void {
  const pdfContent = `
${'='.repeat(80)}
${reportData.title.toUpperCase()}
${'='.repeat(80)}

Date: ${reportData.date}

${'-'.repeat(80)}

${reportData.content}

${'-'.repeat(80)}

${reportData.footer || 'Generated by Royal Academy School Management System'}
${new Date().toLocaleString()}
`;

  const blob = new Blob([pdfContent], { type: 'text/plain;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  
  link.setAttribute('href', url);
  link.setAttribute('download', `${filename}.txt`);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/**
 * Print content (browser print dialog)
 */
export function printContent(): void {
  window.print();
}
