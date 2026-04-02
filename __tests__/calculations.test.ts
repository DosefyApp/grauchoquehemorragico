import { describe, expect, it } from "vitest";
import { grauChoqueHemorragicoEngine } from "@/features/clinical-calculators/engines/engine";

describe("grauChoqueHemorragicoEngine", () => {
  it("classifica classe I", () => {
    const parsed = grauChoqueHemorragicoEngine.parse({
      heartRate: 92,
      systolicBloodPressure: 120,
      pulsePressure: "normal",
      respiratoryRate: 18,
      urineOutput: 40,
      mentalStatus: "normal",
    });
    expect(parsed.success).toBe(true);
    if (!parsed.success) return;

    const result = grauChoqueHemorragicoEngine.compute(parsed.data);
    expect(result.headline.value).toBe("Classe I");
  });

  it("classifica classe II", () => {
    const parsed = grauChoqueHemorragicoEngine.parse({
      heartRate: 112,
      systolicBloodPressure: 118,
      pulsePressure: "reduced",
      respiratoryRate: 24,
      urineOutput: 25,
      mentalStatus: "ansioso",
    });
    expect(parsed.success).toBe(true);
    if (!parsed.success) return;

    const result = grauChoqueHemorragicoEngine.compute(parsed.data);
    expect(result.headline.value).toBe("Classe II");
  });

  it("classifica classe III", () => {
    const parsed = grauChoqueHemorragicoEngine.parse({
      heartRate: 132,
      systolicBloodPressure: 86,
      pulsePressure: "reduced",
      respiratoryRate: 34,
      urineOutput: 10,
      mentalStatus: "confuso",
    });
    expect(parsed.success).toBe(true);
    if (!parsed.success) return;

    const result = grauChoqueHemorragicoEngine.compute(parsed.data);
    expect(result.headline.value).toBe("Classe III");
  });

  it("classifica classe IV", () => {
    const parsed = grauChoqueHemorragicoEngine.parse({
      heartRate: 152,
      systolicBloodPressure: 70,
      pulsePressure: "reduced",
      respiratoryRate: 40,
      urineOutput: 0,
      mentalStatus: "letargico",
    });
    expect(parsed.success).toBe(true);
    if (!parsed.success) return;

    const result = grauChoqueHemorragicoEngine.compute(parsed.data);
    expect(result.headline.value).toBe("Classe IV");
  });
});
