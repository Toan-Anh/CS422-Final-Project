var processDailyIncomeData = (date, data) => {
	let total = 0;
	let tableData = [];
	// let d = `0${date.day}/0${date.month}/${date.year}`;

	if (data)
		Object.keys(data).forEach((orderID, index) => {
			let orderTotal = 0;
			let dishes = [];
			data[orderID].dishes.forEach((dish) => {
				orderTotal += (dish.price * dish.quantity);
				dishes.push({
					dish: dish.dish,
					quantity: dish.quantity,
				});
			});

			tableData.push({
				orderID,
				dishes,
				orderTotal,
				// date: d,
			})
			total += orderTotal;
		});

	return { orderData: tableData, income: total };
}

var processDailyExpenseData = (date, data) => {
	let total = 0;
	let tableData = [];
	// let d = `0${date.day}/0${date.month}/${date.year}`;

	if (data)
		Object.keys(data).forEach((key, index) => {
			total += data[key].value;
			// tableData.push({ index, date: d, ...data[key] });
			tableData.push({
				index: index + 1, ...data[key]
			});
		});

	return { expenseData: tableData, expense: total };
}

var processMonthlyData = (date, data) => {
	let mOrderData = [], mExpenseData = [];
	let mIncome = 0, mExpense = 0;
	let d = {
		year: date.year,
		month: date.month,
	}

	if (data)
		for (let day = 1; day < 32; ++day) {
			if (!data[day]) {
				mOrderData.push(0);
				mExpenseData.push(0);
				continue;
			}

			d.day = day;
			let { income } = processDailyIncomeData(d, data[day].orders);
			let { expense } = processDailyExpenseData(d, data[day].expenses);
			mOrderData.push(income)
			mExpenseData.push(-expense);
			mIncome += income;
			mExpense += expense;
		}

	return { mOrderData, mIncome, mExpenseData, mExpense };
}

var processAnnualData = (date, data) => {
	let yOrderData = [], yExpenseData = [];
	let yIncome = 0, yExpense = 0;
	let d = {
		year: date.year,
	}

	if (data)
		for (let month = 1; month < 13; ++month) {
			if (!data[month]) {
				yOrderData.push(0);
				yExpenseData.push(0);
				continue;
			}

			let { mIncome, mExpense } = processMonthlyData(d, data[month]);
			yOrderData.push(mIncome)
			yExpenseData.push(-mExpense);
			yIncome += mIncome;
			yExpense += mExpense;
		}

	return { yOrderData, yIncome, yExpenseData, yExpense };
}

export default {
	processDailyIncomeData, processDailyExpenseData, processMonthlyData, processAnnualData
}