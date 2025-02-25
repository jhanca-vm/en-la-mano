export default function validateCI(ci: string) {
  if (ci.length !== 8) return false

  const digits = [...ci].map(Number)

  if (digits.some((d) => isNaN(d))) return false

  const a8 = digits[7]
  const weights = [2, 9, 8, 7, 6, 3, 4]

  const sum = digits
    .slice(0, 7)
    .map((digit, index) => (digit * weights[index]) % 10)
    .reduce((acc, val) => acc + val, 0)

  const chd1 = (10 - (sum % 10)) % 10

  return chd1 === a8
}
