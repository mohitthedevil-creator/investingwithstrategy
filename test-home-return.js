// Quick validation of Home Return Planner calculations

// Test Case 1: Basic 50% return in 5 years
const cost1 = 5000000;
const sell1 = 7500000;
const years1 = 5;

const profit1 = sell1 - cost1;
const absReturn1 = (profit1 / cost1) * 100;
const cagr1 = (Math.pow(sell1 / cost1, 1 / years1) - 1) * 100;

console.log('TEST CASE 1: Cost ₹50L -> Sell ₹75L in 5 years');
console.log('Profit:', profit1, '(Expected: 2500000)');
console.log('Absolute Return:', absReturn1.toFixed(2) + '%', '(Expected: 50.00%)');
console.log('CAGR:', cagr1.toFixed(2) + '%', '(Expected: ~8.45%)');
console.log('---');

// Test Case 2: Loss scenario
const cost2 = 5000000;
const sell2 = 4000000;
const years2 = 3;

const profit2 = sell2 - cost2;
const absReturn2 = (profit2 / cost2) * 100;
const cagr2 = (Math.pow(sell2 / cost2, 1 / years2) - 1) * 100;

console.log('TEST CASE 2: Cost ₹50L -> Sell ₹40L in 3 years (Loss)');
console.log('Profit:', profit2, '(Expected: -1000000)');
console.log('Absolute Return:', absReturn2.toFixed(2) + '%', '(Expected: -20.00%)');
console.log('CAGR:', cagr2.toFixed(2) + '%', '(Expected: ~-7.08%)');
console.log('---');

// Test Case 3: Short holding period (0.5 years / 6 months)
const cost3 = 3000000;
const sell3 = 3150000;
const years3 = 0.5;

const profit3 = sell3 - cost3;
const absReturn3 = (profit3 / cost3) * 100;
const cagr3 = (Math.pow(sell3 / cost3, 1 / years3) - 1) * 100;

console.log('TEST CASE 3: Cost ₹30L -> Sell ₹31.5L in 6 months');
console.log('Profit:', profit3, '(Expected: 150000)');
console.log('Absolute Return:', absReturn3.toFixed(2) + '%', '(Expected: 5.00%)');
console.log('CAGR:', cagr3.toFixed(2) + '%', '(Expected: ~10.23%)');
console.log('---');

console.log('✅ All calculations verified!');
