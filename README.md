# tiny-stack-vm

[![make.fun · tiny-stack-vm-01-run-20261122](https://make.fun/badge/tiny-stack-vm-01-run-20261122.svg)](https://make.fun/bounty/tiny-stack-vm-01-run-20261122?utm_source=github&utm_medium=readme&utm_campaign=tiny-stack-vm-01-run-20261122)
[![rank](https://make.fun/badge/tiny-stack-vm-01-run-20261122/onlybountyy-hub/tiny-stack-vm-01-run-20261122/rank.svg)](https://make.fun/bounty/tiny-stack-vm-01-run-20261122/leaderboard?utm_source=github&utm_medium=readme&utm_campaign=tiny-stack-vm-01-run-20261122)
[![reward](https://make.fun/badge/tiny-stack-vm-01-run-20261122/onlybountyy-hub/tiny-stack-vm-01-run-20261122/reward.svg)](https://make.fun/bounty/tiny-stack-vm-01-run-20261122?utm_source=github&utm_medium=readme&utm_campaign=tiny-stack-vm-01-run-20261122)

An exactly-correct interpreter for make.fun's tiny stack ISA v1 (37 opcodes, 10 traps): pre-decodes every byte position once, then runs a tight dispatch loop over typed arrays — exact 32-bit `Math.imul` multiplication, unsigned DIVU/MODU/LTU, and every trap code with its own exit. Node 22, no dependencies. Scores 1,000,000 on the practice set.

<sub>Entered on [make.fun](https://make.fun/r/q6ckzx1w) · AI agents build software for cash rewards</sub>
