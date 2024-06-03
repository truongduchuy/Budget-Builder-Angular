import { Component, ElementRef, QueryList, ViewChildren } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-budget-builder',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './budget-builder.component.html',
  styleUrl: './budget-builder.component.scss'
})
export class BudgetBuilderComponent {
  startDate = new Date(2024, 0, 1); 
  endDate = new Date(2024, 2, 1);

  constructor(public dialogRef: MatDialog) {

  }
  totalIncomes = this.months.fill('')
  totalExpenses = this.months.fill('')
  profitOrLoss = this.months.fill('')
  openingBalances = this.months.fill('')
  closingBalances = this.months.fill('')
  incomeCategories = [
    [
      { name: 'General Income', amounts: this.months.fill('') },
      { name: 'Sales', amounts: this.months.fill('') },
      { name: 'Add a new ‘General Income’ Category', amounts: this.months.fill('') },
      { name: 'Subtotals', amounts: this.months.fill('') },
    ],
    [
      { name: 'Other Income', amounts: this.months.fill('') },
      { name: 'Training', amounts: this.months.fill('') },
      { name: 'Consulting', amounts: this.months.fill('') },
      { name: 'Add new ‘Other Income’ category', amounts: this.months.fill('') },
      { name: 'Subtotals', amounts: this.months.fill('') },
    ]
  ]

  expenseCategories = [
    [
      { name: 'Operational Expenses', amounts: this.months.fill('') },
      { name: 'Management Fees', amounts: this.months.fill('') },
      { name: 'Cloud Hosting', amounts: this.months.fill('') },
      { name: 'Add new ‘Operational Expenses’ category', amounts: this.months.fill('') },
      { name: 'Subtotals', amounts: this.months.fill('') },
    ],
    [
      { name: 'Salaries & Wages', amounts: this.months.fill('') },
      { name: 'Full Time Dev Salaries', amounts: this.months.fill('') },
      { name: 'Part Time Dev Salaries', amounts: this.months.fill('') },
      { name: 'Remote Salaries', amounts: this.months.fill('') },
      { name: 'Add new ‘Sales and Wages’ category', amounts: this.months.fill('') },
      { name: 'Subtotals', amounts: this.months.fill('') },
    ],
  ]

  get months() {
    return this.getMonths(this.startDate, this.endDate)
  }

  updateExpenseSubTotals() {
    for (let monthIndex = 0; monthIndex < this.months.length; monthIndex++) {
      // calculate expenses
      this.totalExpenses[monthIndex] = ''
      for (let expenseListIndex = 0; expenseListIndex < this.expenseCategories?.length; expenseListIndex++) {
        let subtotal = 0;
        for (const category of this.expenseCategories[expenseListIndex]) {
          if (category.name !== 'Subtotals') {
            const amount = parseFloat(category.amounts[monthIndex]);
            subtotal += amount || 0;
          }
        }

        const subTotalsIndex = this.expenseCategories[expenseListIndex].findIndex(item => item.name === 'Subtotals');
        if (subTotalsIndex !== -1) {
          this.expenseCategories[expenseListIndex][subTotalsIndex].amounts[monthIndex] = subtotal > 0 ? subtotal.toString() : '';
          this.totalExpenses[monthIndex] = (+this.totalExpenses[monthIndex] + subtotal) as unknown as string || ''
        }
      }

      // calculate income
      this.totalIncomes[monthIndex] = ''
      for (let incomeListIndex = 0; incomeListIndex < this.incomeCategories?.length; incomeListIndex++) {
        let subtotal = 0;
        for (const category of this.incomeCategories[incomeListIndex]) {
          if (category.name !== 'Subtotals') {
            const amount = parseFloat(category.amounts[monthIndex]);
            subtotal += amount || 0;
          }
        }

        const subTotalsIndex = this.incomeCategories[incomeListIndex].findIndex(item => item.name === 'Subtotals');
        if (subTotalsIndex !== -1) {
          this.incomeCategories[incomeListIndex][subTotalsIndex].amounts[monthIndex] = subtotal > 0 ? subtotal.toString() : '';
          this.totalIncomes[monthIndex] = (+this.totalIncomes[monthIndex] + subtotal) as unknown as string
        }
      }

      // calculate profile/loss, opening balance, closing balance
      for (let monthIndex = 0; monthIndex < this.months.length; monthIndex++) {
        this.profitOrLoss[monthIndex] = (+this.totalIncomes[monthIndex] - +this.totalExpenses[monthIndex]) as unknown as string
        this.openingBalances[monthIndex] = monthIndex === 0 ? '0' : this.closingBalances[monthIndex - 1]
        this.closingBalances[monthIndex] = (+this.profitOrLoss[monthIndex] + +this.openingBalances[monthIndex]) as unknown as string
      }
    }
  }

  updateIncomeSubTotals() {
    for (let monthIndex = 0; monthIndex < this.months.length; monthIndex++) {


    }
  }

  deleteCategory(type: string, parentIndex: number, index: number) {
    let list = type === 'income' ? this.incomeCategories : this.expenseCategories
    if (index === 0 || index === list[parentIndex].length - 1) return; // couldn't delete main income and subtotals
    list[parentIndex] = list[parentIndex].filter((_, idx) => idx !== index)
    this.updateIncomeSubTotals()
    this.updateExpenseSubTotals()
  }

  onChange(newValue: string, categoryIndex: number, monthIndex: number) {
    this.updateIncomeSubTotals()
    this.updateExpenseSubTotals()
  }

  @ViewChildren('inputField') inputFields!: QueryList<ElementRef<HTMLInputElement>>;
  focusedInputIndex: number | null = null;

  // Apply the value of the current cell to all cells in the same row
  applyToAll(type: string, categoryIndex: number, monthIndex: number, parentIndex: number) {
    if (type === 'income') {
      const valueToApply = this.incomeCategories[parentIndex][categoryIndex].amounts[monthIndex];
      this.incomeCategories[parentIndex][categoryIndex].amounts.fill(valueToApply);
    }
    else {
      const valueToApply = this.expenseCategories[parentIndex][categoryIndex].amounts[monthIndex];
      this.expenseCategories[parentIndex][categoryIndex].amounts.fill(valueToApply);
    }

    this.updateIncomeSubTotals()
    this.updateExpenseSubTotals()
  }

  getMonths(startDate: Date, endDate: Date): string[] {
    const months = [];
    const currentMonth = new Date(startDate);

    while (currentMonth <= endDate) {
      const monthName = currentMonth.toLocaleString('en', { month: 'long' });
      const year = currentMonth.getFullYear();
      months.push(`${monthName} ${year}`);

      currentMonth.setMonth(currentMonth.getMonth() + 1); // Move to the next month
    }

    return months;
  }
  // ... (Methods for calculations, adding/deleting categories, etc.)
}
