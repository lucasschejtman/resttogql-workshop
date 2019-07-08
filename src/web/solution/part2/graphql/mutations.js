export const UpdateCompanyStock = `mutation UpdateCompanyStock {
  updateCompanyStock(company_id: 4) {
    delta,
    stock_value
  }
}`;
