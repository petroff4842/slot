export function easeOutBack(t, overshoot = 1.7) {
  const c1 = overshoot;
  const c3 = c1 + 1;
  const x = t - 1;
  return 1 + c3 * x * x * x + c1 * x * x;
}
