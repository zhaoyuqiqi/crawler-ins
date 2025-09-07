export interface Token {
  token: string;
}
export interface JWTToken extends Token {
  lastUsed: number;
  failures: number;
  disabledUntil: number;
}

export class JWTManager {
  tokens: JWTToken[];
  cooldown: number;
  maxFailures: number;
  /**
   * tokens: [{token: "xxx", weight: 1}, ...]
   * cooldownSeconds: 单个 token 冷却时间
   * maxFailures: 单个 token 连续失败次数阈值
   */
  constructor(tokens: Token[], cooldownSeconds = 5, maxFailures = 1) {
    this.tokens = tokens.map((t) => ({
      token: t.token,
      lastUsed: 0,
      failures: 0,
      disabledUntil: 0,
    }));
    this.cooldown = cooldownSeconds * 1000;
    this.maxFailures = maxFailures;
  }

  // 获取可用 token
  getNextToken() {
    const now = Date.now();
    // 过滤掉冷却中或禁用的 token
    const available: JWTToken[] = [];
    for (const tk of this.tokens) {
      if (now - tk.lastUsed >= this.cooldown && now >= tk.disabledUntil) {
        available.push(tk);
      }
    }

    if (available.length === 0) return null;

    // 随机选择一个 token（根据权重）
    const chosen = available[Math.floor(Math.random() * available.length)];
    chosen.lastUsed = now;
    return chosen;
  }

  // 请求失败回调
  reportFailure(tokenObj: JWTToken) {
    const idx = this.tokens.findIndex(
      (token) => token.token === tokenObj.token
    );
    if (idx < 0) {
      return;
    }
    this.tokens[idx].failures++;
    if (this.tokens[idx].failures >= this.maxFailures) {
      // 禁用 token 一段时间
      this.tokens[idx].disabledUntil = Date.now() + this.cooldown * 5; // 5 倍冷却时间
      this.tokens[idx].failures = 0;
      console.warn(`Token ${this.tokens[idx].token} 临时禁用`);
    }
  }

  // 请求成功回调
  reportSuccess(tokenObj: JWTToken) {
    const idx = this.tokens.findIndex(
      (token) => token.token === tokenObj.token
    );
    if (idx !== -1) {
      this.tokens[idx].failures = 0;
    }
  }
}
