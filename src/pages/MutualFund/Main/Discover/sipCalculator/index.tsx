import { useState, useEffect } from "react";
import ReactApexChart from "react-apexcharts";
import { Card } from "reactstrap";

const SipCalculator = () => {
  const [expectedReturn, setExpectedReturn] = useState(12);
  const [monthlySIP, setMonthlySIP] = useState(500);
  const [years, setYears] = useState(5);
  const [invested, setInvested] = useState(0);
  const [gain, setGain] = useState(0);

  useEffect(() => {
    calculateSIP();
  }, [expectedReturn, monthlySIP, years]);

  const calculateSIP = () => {
    const months = years * 12;
    const monthlyRate = expectedReturn / 100 / 12;
    const maturityValue =
      monthlySIP *
      ((Math.pow(1 + monthlyRate, months) - 1) / monthlyRate) *
      (1 + monthlyRate);

    const totalInvested = monthlySIP * months;
    const totalGain = maturityValue - totalInvested;

    setInvested(totalInvested);
    setGain(totalGain);
  };

  const chartOptions = {
    labels: ["Total Invested", "Gain"],
    colors: ["#1e4d7a", "#6ec5ff"],
    legend: { show: false },
    dataLabels: { enabled: false },
    stroke: { width: 0 },
    yaxis: {
      labels: {
        formatter: function (val: number) {
          return Math.round(val).toString(); // ensures no decimals
        },
      },
    },
  };

  return (
    <Card
      style={{
        borderRadius: "12px",
        marginBottom: "12px",
        padding: "10px", // reduced from 16px
      }}
    >
      {/* Title */}
      <h5 className="text-sm font-semibold mb-3">SIP Calculator</h5>

      {/* Chart */}
      <div className="flex justify-center mb-4">
        <ReactApexChart
          options={chartOptions}
          series={[invested, gain]}
          type="donut"
          height={120}
        />
      </div>

      {/* Inputs */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "8px", // reduced from 12px
          borderTop: "1px solid #e5e7eb",
          paddingTop: "8px",
        }}
      >
        {/* Expected Returns */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <label style={{ fontSize: "12px", color: "#6b7280" }}>
            Expected Returns % (p.a)
          </label>
          <input
            type="number"
            value={expectedReturn}
            onChange={(e) => setExpectedReturn(Number(e.target.value))}
            style={{
              width: "80px",
              padding: "4px",
              fontSize: "14px",
              textAlign: "right",
              border: "1px solid #d1d5db",
              borderRadius: "6px",
            }}
          />
        </div>

        {/* Monthly SIP Amount */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <label style={{ fontSize: "12px", color: "#6b7280" }}>
            Monthly SIP Amount
          </label>
          <input
            type="number"
            value={monthlySIP}
            onChange={(e) => setMonthlySIP(Number(e.target.value))}
            style={{
              width: "80px",
              padding: "4px",
              fontSize: "14px",
              textAlign: "right",
              border: "1px solid #d1d5db",
              borderRadius: "6px",
            }}
          />
        </div>
      </div>

      {/* Year Selector */}

      <div style={{ marginTop: "8px" }}>
        <label
          style={{ fontSize: "14px", marginBottom: "6px", display: "block" }}
        >
          {years} Year
        </label>
        <input
          type="range"
          min={1}
          max={15}
          step={1}
          value={years}
          onChange={(e) => setYears(Number(e.target.value))}
          style={{ width: "100%" }}
        />
      </div>

      {/* Bottom Stats */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginTop: "16px",
          gap: "12px",
        }}
      >
        {/* Total Invested */}
        <div
          style={{
            flex: 1,
            padding: "8px",
            border: "1px solid #e5e7eb",
            borderRadius: "8px",
            backgroundColor: "#fff",
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-start",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              marginBottom: "4px",
            }}
          >
            <span
              style={{
                width: "12px",
                height: "12px",
                borderRadius: "2px",
                backgroundColor: "#1E4D7A", // dark blue
                display: "inline-block",
                marginRight: "6px",
              }}
            ></span>
            <span style={{ fontSize: "12px" }}>Total Invested</span>
          </div>
          <p
            style={{
              fontSize: "14px",
              fontWeight: "bold",
              margin: 0,
              color: "#111827",
            }}
          >
            {invested.toLocaleString()}
          </p>
        </div>

        {/* Gain */}
        <div
          style={{
            flex: 1,
            padding: "8px",
            border: "1px solid #e5e7eb",
            borderRadius: "8px",
            backgroundColor: "#fff",
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-start",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              marginBottom: "4px",
            }}
          >
            <span
              style={{
                width: "12px",
                height: "12px",
                borderRadius: "2px",
                backgroundColor: "#6EC5FF", // light blue
                display: "inline-block",
                marginRight: "6px",
              }}
            ></span>
            <span style={{ fontSize: "12px" }}>Gain</span>
          </div>
          <p
            style={{
              fontSize: "14px",
              fontWeight: "bold",
              margin: 0,
              color: "#16a34a",
            }}
          >
            {Math.round(gain).toLocaleString()} (
            {Math.round((gain / invested) * 100)}%)
          </p>
        </div>
      </div>
    </Card>
  );
};

export default SipCalculator;
