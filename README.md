# Setups
Build on top of [winstonjs](https://github.com/winstonjs/winston), it provides me with the configuration i need for my projects

## Implementation
```ts
import { AcronixLogger } from "acronix-logger";
AcronixLogger.genLogDir();
export const log = new AcronixLogger();
log.$info('Logger started!')
```
