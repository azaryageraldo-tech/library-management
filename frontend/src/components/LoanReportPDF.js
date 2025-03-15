import React from 'react';
import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';

const styles = StyleSheet.create({
  page: {
    padding: 30,
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
    textAlign: 'center',
  },
  table: {
    display: 'table',
    width: '100%',
    marginBottom: 20,
  },
  tableRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#000',
    borderBottomStyle: 'solid',
    alignItems: 'center',
    minHeight: 24,
  },
  tableHeader: {
    backgroundColor: '#f0f0f0',
  },
  tableCell: {
    flex: 1,
    padding: 5,
    fontSize: 10,
  },
  statistics: {
    marginTop: 20,
    fontSize: 12,
  }
});

const LoanReportPDF = ({ loans, statistics, dateRange }) => (
  <Document>
    <Page size="A4" style={styles.page}>
      <Text style={styles.title}>Loan Report</Text>
      
      <Text style={styles.statistics}>
        Period: {dateRange.start} - {dateRange.end}
      </Text>

      <View style={[styles.table, { marginTop: 20 }]}>
        <View style={[styles.tableRow, styles.tableHeader]}>
          <Text style={styles.tableCell}>Book Title</Text>
          <Text style={styles.tableCell}>Member</Text>
          <Text style={styles.tableCell}>Borrow Date</Text>
          <Text style={styles.tableCell}>Status</Text>
        </View>

        {loans.map((loan, index) => (
          <View key={index} style={styles.tableRow}>
            <Text style={styles.tableCell}>{loan.book.title}</Text>
            <Text style={styles.tableCell}>{loan.member.name}</Text>
            <Text style={styles.tableCell}>
              {new Date(loan.borrowDate).toLocaleDateString()}
            </Text>
            <Text style={styles.tableCell}>{loan.status}</Text>
          </View>
        ))}
      </View>

      <View style={styles.statistics}>
        <Text style={{ marginBottom: 10 }}>Summary Statistics:</Text>
        <Text>Total Loans: {loans.length}</Text>
        <Text>Active Loans: {loans.filter(l => l.status === 'BORROWED').length}</Text>
        <Text>Overdue Loans: {loans.filter(l => l.status === 'OVERDUE').length}</Text>
      </View>
    </Page>
  </Document>
);

export default LoanReportPDF;