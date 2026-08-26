let str = 'THU OCT 08 2026 05:30:00 GMT0530 INDIA STANDARD TIME'; const match = str.match(/(?:[a-z]{3}\s+)?([a-z]{3})\s+(\d{1,2})\s+(\d{4})/i); console.log(match);
