
      const fmt = new Intl.NumberFormat("en-IN", {
        style: "currency",
        currency: "INR",
        maximumFractionDigits: 0,
      });

      const state = {
        carValueLakh: 18,
        loanRate: 9.5,
        tenureYears: 5,
        wealthEnabled: false,
        selectedStrategyKey: "S1",
        salary: 100000,
        investPct: 40,
        upfrontCash: 200000,
        buyMonths: 36,
        userCagr: 12,
        upfrontPct: 20,
      };

      const banks = [
        { name: "HDFC Bank", rate: 9.25 },
        { name: "ICICI Bank", rate: 9.5 },
        { name: "SBI", rate: 9.1 },
        { name: "Axis Bank", rate: 9.35 },
      ];

      const els = {
        carValueRange: document.getElementById("carValueRange"),
        carValueInput: document.getElementById("carValueInput"),
        loanRateRange: document.getElementById("loanRateRange"),
        loanRateInput: document.getElementById("loanRateInput"),
        loanTenureRange: document.getElementById("loanTenureRange"),
        loanTenureInput: document.getElementById("loanTenureInput"),
        salaryRange: document.getElementById("salaryRange"),
        salaryInput: document.getElementById("salaryInput"),
        investPctRange: document.getElementById("investPctRange"),
        investPctInput: document.getElementById("investPctInput"),
        upfrontCashRange: document.getElementById("upfrontCashRange"),
        upfrontCashInput: document.getElementById("upfrontCashInput"),
        buyMonthRange: document.getElementById("buyMonthRange"),
        buyMonthInput: document.getElementById("buyMonthInput"),
        userCagrRange: document.getElementById("userCagrRange"),
        userCagrInput: document.getElementById("userCagrInput"),
        upfrontPctRange: document.getElementById("upfrontPctRange"),
        upfrontPctInput: document.getElementById("upfrontPctInput"),
        userLoanEmi: document.getElementById("userLoanEmi"),
        userLoanPrincipal: document.getElementById("userLoanPrincipal"),
        userLoanInterest: document.getElementById("userLoanInterest"),
        userLoanTotalPayment: document.getElementById("userLoanTotalPayment"),
        sipCap: document.getElementById("sipCap"),
        strategyButtons: document.getElementById("strategyButtons"),
        strategySummary: document.getElementById("strategySummary"),
        aiOutput: document.getElementById("aiOutput"),
        wealthInputs: document.getElementById("wealthInputs"),
        wealthPanel: document.getElementById("wealthPanel"),
        wealthSummary: document.getElementById("wealthSummary"),
        optimizeWealthBtn: document.getElementById("optimizeWealthBtn"),
      };

      function clamp(value, min, max) {
        return Math.min(max, Math.max(min, value));
      }

      function setRangeFill(rangeEl) {
        const min = Number(rangeEl.min);
        const max = Number(rangeEl.max);
        const value = Number(rangeEl.value);
        const percent = max === min ? 0 : ((value - min) / (max - min)) * 100;
        rangeEl.style.background = `linear-gradient(90deg, var(--brand) ${percent}%, #e5e7eb ${percent}%)`;
      }

      function syncInput(rangeEl, inputEl, key, parser = Number) {
        rangeEl.value = state[key];
        inputEl.value = state[key];
        setRangeFill(rangeEl);

        const update = (value) => {
          const num = parser(value);
          if (!Number.isFinite(num)) return;
          const min = Number(rangeEl.min);
          const max = Number(rangeEl.max);
          const next = clamp(num, min, max);
          state[key] = next;
          rangeEl.value = next;
          inputEl.value = next;
          setRangeFill(rangeEl);
          calculate();
        };

        rangeEl.addEventListener("input", (e) => update(e.target.value));
        inputEl.addEventListener("input", (e) => update(e.target.value));
      }

      function emi(principal, annualRate, years) {
        const months = Math.max(1, Math.round(years * 12));
        const r = annualRate / 100 / 12;
        if (r === 0) {
          return principal / months;
        }
        const pow = Math.pow(1 + r, months);
        return (principal * r * pow) / (pow - 1);
      }

      function futureValueFromSip(sip, annualRate, months) {
        const m = Math.max(1, Math.round(months));
        const r = annualRate / 100 / 12;
        if (r === 0) {
          return sip * m;
        }
        const factor = (Math.pow(1 + r, m) - 1) / r;
        return sip * factor;
      }

      function growLump(value, annualRate, months) {
        const r = annualRate / 100 / 12;
        return value * Math.pow(1 + r, Math.max(1, Math.round(months)));
      }

      function loanFromEmi(targetEmi, annualRate, years) {
        const months = Math.max(1, Math.round(years * 12));
        const r = annualRate / 100 / 12;
        if (r === 0) return targetEmi * months;
        const pow = Math.pow(1 + r, months);
        return targetEmi * (pow - 1) / (r * pow);
      }

      function fmtCompact(value) {
        if (!Number.isFinite(value) || value <= 0) return "₹ 0";
        const abs = Math.abs(value);
        if (abs >= 1e7) return "₹ " + (value / 1e7).toFixed(2) + " Cr";
        if (abs >= 1e5) return "₹ " + (value / 1e5).toFixed(2) + " L";
        return fmt.format(value);
      }

      function calculate() {
        const carValue = state.carValueLakh * 100000;
        const upfrontNeeded = state.wealthEnabled ? carValue * (state.upfrontPct / 100) : 0;
        const principal = Math.max(0, carValue - upfrontNeeded);
        const monthlyEmi = emi(principal, state.loanRate, state.tenureYears);
        const months = Math.max(1, Math.round(state.tenureYears * 12));
        const totalPayment = monthlyEmi * months;
        const totalInterest = totalPayment - principal;

        els.userLoanEmi.textContent = fmt.format(monthlyEmi);
        els.userLoanPrincipal.textContent = fmt.format(principal);
        els.userLoanInterest.textContent = fmt.format(totalInterest);
        els.userLoanTotalPayment.textContent = fmt.format(totalPayment);

        if (state.wealthEnabled) {
          renderAiSuggestion();
        } else {
          els.aiOutput.innerHTML = "";
                  }
      }

      function tenureVariants(baseYears) {
        const down = Math.max(2, baseYears - 2);
        const up = Math.min(10, baseYears + 2);
        const uniq = Array.from(new Set([down, baseYears, up]));
        return uniq.sort((a, b) => a - b);
      }

      function renderAiSuggestion() {
        if (!state.wealthEnabled) return;

        const carValue = state.carValueLakh * 100000;
        const buyMonths = Math.max(1, Math.round(state.buyMonths));
        const tenureYears = Math.max(1, Math.round(state.tenureYears));
        const loanRate = state.loanRate;
        const cap = state.salary * (state.investPct / 100);

        const insurance = carValue * 0.03;
        const goalRate = 7;
        const longRate = state.userCagr;
        const upfrontCashNow = Math.max(0, state.upfrontCash);

        const strategies = [
          { key: "S1", label: "Optimized for Max Asset", goalShare: 0.30, longShare: 0.70, loanSipMin: 5000 },
          { key: "S2", label: "Optimized for Balance", goalShare: 0.55, longShare: 0.45, loanSipMin: null },
          { key: "S3", label: "Optimized for Comfort", goalShare: 0.75, longShare: 0.25, loanSipMin: null },
        ];

        function computeStrategyForTenure(s, years) {
          const loanMonths = Math.max(1, Math.round(years * 12));
          const goalSip = cap * s.goalShare;
          const longSip = cap * s.longShare;

          const upfrontAtPurchase = growLump(upfrontCashNow, goalRate, buyMonths);
          const goalCorpus = futureValueFromSip(goalSip, goalRate, buyMonths) + upfrontAtPurchase;
          const longCorpusAtPurchase = futureValueFromSip(longSip, longRate, buyMonths);

          const upfrontNeeded = carValue * (state.upfrontPct / 100);
          const availableForDownPayment = Math.max(0, goalCorpus - insurance);
          const baseDownPayment = Math.min(carValue, availableForDownPayment);
          const extraAvailable = Math.max(0, baseDownPayment - upfrontNeeded);
          let downPaymentUsed = baseDownPayment;
          if (s.key === "S1") {
            downPaymentUsed = Math.min(baseDownPayment, upfrontNeeded);
          }
          if (s.key === "S2") {
            downPaymentUsed = Math.min(baseDownPayment, upfrontNeeded + extraAvailable * 0.5);
          }
          if (s.key === "S3") {
            downPaymentUsed = baseDownPayment;
          }
          const surplusGoalCash = Math.max(0, availableForDownPayment - downPaymentUsed);
          

          const baseLoanNeeded = Math.max(0, carValue - downPaymentUsed);

          let loanAmt = baseLoanNeeded;
          let monthlyEmi = emi(loanAmt, loanRate, years);
          let sipDuringLoan = Math.max(0, cap - monthlyEmi);
          let excessLoanInvested = 0;

          if (s.key === "S1") {
            const sipMin = Math.min(cap, Math.max(0, s.loanSipMin));
            const maxEmiAllowed = Math.max(0, cap - sipMin);
            const maxLoan = loanFromEmi(maxEmiAllowed, loanRate, years);
            loanAmt = Math.max(baseLoanNeeded, maxLoan);
            monthlyEmi = emi(loanAmt, loanRate, years);
            sipDuringLoan = Math.max(0, cap - monthlyEmi);
            excessLoanInvested = Math.max(0, loanAmt - baseLoanNeeded);
          }

          const feasible = monthlyEmi <= cap + 1e-6;

          const longGrown = growLump(longCorpusAtPurchase, longRate, loanMonths);
          const sipLoanFV = futureValueFromSip(sipDuringLoan, longRate, loanMonths);
          const surplusGrown = growLump(surplusGoalCash, longRate, loanMonths);
          const excessGrown = growLump(excessLoanInvested, longRate, loanMonths);

          const endAsset = feasible ? (longGrown + sipLoanFV + surplusGrown + excessGrown) : 0;

          return {
            key: s.key,
            label: s.label,
            tenureYears: years,
            goalSip,
            longSip,
            upfrontAtPurchase,
            goalCorpus,
            insurance,
            upfrontNeeded,
            downPaymentUsed,
            loanAmt,
            monthlyEmi,
            sipDuringLoan,
            moneyRemainingAfterPurchase: feasible ? (longCorpusAtPurchase + surplusGoalCash + excessLoanInvested) : 0,
            endAsset,
            feasible,
          };
        }

        const results = strategies.map(s => computeStrategyForTenure(s, tenureYears));

        const selected = results.find(r => r.key === state.selectedStrategyKey) || results[0];

        els.strategyButtons.innerHTML = results.map(r => {
          const active = r.key === selected.key ? "active" : "";
          return `<button data-key="${r.key}" class="${active}">${r.label}</button>`;
        }).join("");

        els.strategyButtons.querySelectorAll("button").forEach(btn => {
          btn.addEventListener("click", () => {
            state.selectedStrategyKey = btn.dataset.key;
            renderAiSuggestion();
          });
        });

        els.strategySummary.innerHTML = `
          <div class="summary-row">
            <span>Loan</span>
            <strong>${fmtCompact(selected.loanAmt)}</strong>
          </div>
          <div class="summary-row">
            <span>EMI</span>
            <strong>${fmtCompact(selected.monthlyEmi)}</strong>
          </div>
          <div class="summary-row">
            <span>SIP (loan yrs)</span>
            <strong>${fmtCompact(selected.sipDuringLoan)}</strong>
          </div>
          <div class="summary-row">
            <span>End Asset</span>
            <strong style="color: var(--brand);">${fmtCompact(selected.endAsset)}</strong>
          </div>
        `;

        els.sipCap.textContent = fmt.format(cap);

        function tenureNoteForStrategy(strategyKey) {
          const s = strategies.find(x => x.key === strategyKey);
          const series = tenureVariants(tenureYears)
            .map(y => computeStrategyForTenure(s, y))
            .filter(r => r.feasible);
          if (!series.length) return "Tenure sensitivity: not feasible under current cap.";
          const base = series.find(r => r.tenureYears === tenureYears) || series[0];
          const best = series.reduce((acc, r) => (r.endAsset > acc.endAsset ? r : acc), series[0]);
          const delta = base.endAsset <= 0 ? 0 : ((best.endAsset - base.endAsset) / base.endAsset) * 100;
          if (best.tenureYears === base.tenureYears || Math.abs(delta) < 5) {
            return "Tenure sensitivity: changing tenure by +/-2y has no substantial benefit (<5%).";
          }
          const dir = best.tenureYears > base.tenureYears ? "increasing" : "decreasing";
          return `Tenure sensitivity: ${dir} tenure to ${best.tenureYears} years improves end asset by ~${delta.toFixed(1)}%.`;
        }

        const tenureTxt = tenureNoteForStrategy(selected.key);
        const feasibilityBadge = selected.feasible
          ? `<span style="display:inline-block; margin-left:10px; font-size:12px; font-weight:800; color:#065f46; background:#e0f7f4; padding:3px 10px; border-radius:999px;">Feasible</span>`
          : `<span style="display:inline-block; margin-left:10px; font-size:12px; font-weight:800; color:#7c2d12; background:#ffedd5; padding:3px 10px; border-radius:999px;">Not feasible</span>`;

        const pathBlocks = `
            <div class="card" style="box-shadow:none; border:1px solid var(--border); margin-top: 14px;">
              <div style="display:flex; align-items:center; justify-content:space-between; gap:12px; flex-wrap:wrap;">
                <h3 style="margin:0; font-size:16px;">${selected.label} - Plan Summary</h3>
                ${feasibilityBadge}
              </div>

              <div style="margin-top:10px; padding:10px 12px; border-radius:10px; background:#f8f9fb; font-weight:900; color: var(--brand);">
                Wealth at end: ${fmtCompact(selected.endAsset)}
              </div>

              <div style="margin-top:8px; font-size:13px; color: var(--muted); line-height:1.6;">
                Here is the simple path to follow:
              </div>

              <div style="margin-top:12px; background:#ecfdf5; border:1px solid #d1fae5; border-radius:12px; padding:12px;">
                <div style="font-weight:800; margin-bottom:8px;">Before Buying</div>
                <div class="summary-row"><span>Monthly SIP for upfront + insurance</span><strong>${fmtCompact(selected.goalSip)}</strong></div>
                <div class="summary-row"><span>Monthly long-term SIP (keeps growing)</span><strong>${fmtCompact(selected.longSip)}</strong></div>
                <div class="summary-row"><span>Money you already have today (grows)</span><strong>${fmtCompact(selected.upfrontAtPurchase)}</strong></div>
              </div>

              <div style="margin-top:12px; background:#eff6ff; border:1px solid #dbeafe; border-radius:12px; padding:12px;">
                <div style="font-weight:800; margin-bottom:8px;">At Purchase</div>
                <div class="summary-row"><span>Total goal fund available</span><strong>${fmtCompact(selected.goalCorpus)}</strong></div>
                <div class="summary-row"><span>Insurance payment</span><strong>${fmtCompact(selected.insurance)}</strong></div>
                <div class="summary-row"><span>Upfront required (target)</span><strong>${fmtCompact(selected.upfrontNeeded)}</strong></div>
                <div class="summary-row"><span>Upfront paid (available)</span><strong>${fmtCompact(selected.downPaymentUsed)}</strong></div>
                <div class="summary-row"><span>Loan amount to be taken</span><strong>${fmtCompact(selected.loanAmt)}</strong></div>
              </div>

              <div style="margin-top:12px; background:#fff7ed; border:1px solid #ffedd5; border-radius:12px; padding:12px;">
                <div style="font-weight:800; margin-bottom:8px;">Post Purchase</div>
                <div class="summary-row"><span>Monthly EMI for ${selected.tenureYears} years</span><strong>${fmtCompact(selected.monthlyEmi)}</strong></div>
                <div class="summary-row"><span>Monthly SIP you can still invest</span><strong>${fmtCompact(selected.sipDuringLoan)}</strong></div>
              </div>

              <div class="note" style="margin-top:10px;">${tenureTxt}</div>

              <div class="note" style="margin-top:10px;">
                Where to invest:
                <ul style="margin:10px 0 0; padding-left: 18px; color: var(--muted); line-height: 1.6;">
                  <li><strong>Goal fund (till purchase):</strong> Liquid / ultra-short / short-duration debt fund or FD (target ~7% p.a.).</li>
                  <li><strong>Long-term investing:</strong> diversified equity index fund (target ~${longRate}% p.a.).</li>
                </ul>
              </div>
            </div>
          `;

        els.aiOutput.innerHTML = pathBlocks;
      }

      els.optimizeWealthBtn.addEventListener("click", () => {
        state.wealthEnabled = !state.wealthEnabled;
        els.wealthInputs.style.display = state.wealthEnabled ? "block" : "none";
        els.wealthPanel.style.display = state.wealthEnabled ? "block" : "none";
        els.wealthSummary.style.display = state.wealthEnabled ? "block" : "none";
        calculate();
      });

      syncInput(els.carValueRange, els.carValueInput, "carValueLakh");
      syncInput(els.loanRateRange, els.loanRateInput, "loanRate");
      syncInput(els.loanTenureRange, els.loanTenureInput, "tenureYears");
      syncInput(els.salaryRange, els.salaryInput, "salary");
      syncInput(els.investPctRange, els.investPctInput, "investPct");
      syncInput(els.upfrontCashRange, els.upfrontCashInput, "upfrontCash");
      syncInput(els.buyMonthRange, els.buyMonthInput, "buyMonths");
      syncInput(els.userCagrRange, els.userCagrInput, "userCagr");
      syncInput(els.upfrontPctRange, els.upfrontPctInput, "upfrontPct");

      calculate();
    