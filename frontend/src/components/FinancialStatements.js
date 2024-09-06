import React, { useState, useEffect } from 'react';
import axios from 'axios';

function FinancialStatements({ cik, accessionNumber, onComplete, ticker }) {
    const [loading, setLoading] = useState(true);
    const [financialData, setFinancialData] = useState({
        income_statement: [],
        balance_sheet: [],
        cash_flow_statement: []
    });

    useEffect(() => {
        console.log("ticker", ticker);
        // Fetch financial data from the backend API
        axios.get(`http://localhost:8000/api/financial-data?ticker=${ticker}`)  // Adjust this to your actual API endpoint and query string
            .then(response => {
                console.log(response.status);
                setFinancialData(response.data);  // Set the financial data
                setLoading(false);  // Mark loading as false once data is loaded
            })
            .catch(error => {
                console.error('Error fetching financial data:', error);
                setLoading(false);  // Even on error, stop showing the loading spinner
            });
    }, []);  // Runs once when the component mounts

    // Helper function to render tables
    const renderTable = (title, data) => {
        // Sort the years in descending order (newest first)
        const sortedYears = Object.keys(data[0]).slice(1).sort((a, b) => {
            const yearA = new Date(a).getFullYear();
            const yearB = new Date(b).getFullYear();
            return yearB - yearA;
        });
    
        return (
            <div>
                <h3>{title}</h3>
                {data && data.length > 0 ? (
                    <table border="1" style={{ width: '100%', textAlign: 'left' }}>
                        <thead>
                            <tr>
                                <th>Metric</th>
                                {sortedYears.map((year, index) => (
                                    <th key={index}>{year}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {data.map((row, index) => (
                                <tr key={index}>
                                    <td>{row.Metric}</td>
                                    {sortedYears.map((year, idx) => (
                                        <td key={idx}>{row[year]}</td>
                                    ))}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                ) : (
                    <p>No data available for {title}</p>
                )}
            </div>
        );
    };

    // Render the tables only after the data is loaded
    return (
        <div style={{ position: 'relative', height: '80vh', width: '100%' }}>
            {loading ? (
                <div>Loading...</div>
            ) : (
                <>
                <h1>Financial Statements for {ticker.toUpperCase()}</h1>
                    {renderTable('Income Statement', financialData.income_statement)}
                    {renderTable('Balance Sheet', financialData.balance_sheet)}
                    {renderTable('Cash Flow Statement', financialData.cash_flow_statement)}
                </>
            )}
            <button onClick={onComplete} style={{ marginTop: '20px' }}>
                Complete Step 2!
            </button>
        </div>
    );
}

export default FinancialStatements;
