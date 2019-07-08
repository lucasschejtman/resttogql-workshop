export const UpdateCompanyStock = `mutation UpdateCompanyStock($company_id: Int!) {
  updateCompanyStock(company_id: $company_id) {
    delta,
    stock_value
  }
}`;
