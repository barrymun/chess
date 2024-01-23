module.exports = {
  plugins: [require('@trivago/prettier-plugin-sort-imports')],
  printWidth: 120,
  tabWidth: 2,
  importOrder: ["<THIRD_PARTY_MODULES>", "^(components)/?(.*)$", "^[./]"],
  importOrderSeparation: true,
  importOrderSortSpecifiers: true,
  importOrderCaseInsensitive: true,
}
