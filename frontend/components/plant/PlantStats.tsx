import { ThingsBoardService } from "@/services/ThingsBoardService";
import { Plant } from "@/types";
import { useTranslation } from "next-i18next";
import { useEffect, useState } from "react";
import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  Tooltip,
  XAxis,
  YAxis,
  ResponsiveContainer,
} from "recharts";
import useInterval from "use-interval";
import ExtraMetrics from "./ExtraMetrics";

type Props = {
  plant: Plant;
};

const PlantStats: React.FC<Props> = ({ plant }) => {
  const [timeframe, setTimeframe] = useState<"hour" | "week" | "month">("hour");
  const [temperatureStats, setTemperatureStats] = useState<any[]>([]);
  const [lightLevelStats, setLightStats] = useState<any[]>([]);
  const [moistureStats, setMoistureStats] = useState<any[]>([]);
  const [humidityStats, setHumidityStats] = useState<any[]>([]);
  const [waterLevelStats, setWaterStats] = useState<any[]>([]);

  const { t } = useTranslation();
  const resetStats = () => {
    setTemperatureStats([]);
    setLightStats([]);
    setMoistureStats([]);
    setHumidityStats([]);
    setWaterStats([]);
  };
  const getStats = async () => {
    const data = await ThingsBoardService.getStatsByTimeframe(timeframe);

    if (data) {
      resetStats();

      const t = data["temperature"];
      const l = data["Light Level"];
      const s = data["Soil Moisture"];
      const h = data["Humidity"];
      const w = data["WaterLevel"];

      if (t) {
        let temperature = t.map((temp: any, index: number) => ({
          name: index,
          pv: parseFloat(temp.value),
          uv: new Date(temp.ts).toLocaleTimeString(),
        }));
        temperature = temperature.reverse();
        setTemperatureStats(temperature);
      }
      if (s) {
        let moisture = s.map((moist: any, index: number) => ({
          name: index,
          pv: parseFloat(moist.value),
          uv: new Date(moist.ts).toLocaleTimeString(),
        }));
        moisture = moisture.reverse();
        setMoistureStats(moisture);
      }
      if (h) {
        let humidity = h.map((humid: any, index: number) => ({
          name: index,
          pv: parseFloat(humid.value),
          uv: new Date(humid.ts).toLocaleTimeString(),
        }));
        humidity = humidity.reverse();
        setHumidityStats(humidity);
      }
      if (l) {
        let light = l.map((light: any, index: number) => ({
          name: index,
          pv: parseFloat(light.value),
          uv: new Date(light.ts).toLocaleTimeString(),
        }));
        light = light.reverse();
        setLightStats(light);
      }

      if (w) {
        let water = w.map((water: any, index: number) => ({
          name: index,
          pv: parseFloat(water.value),
          uv: new Date(water.ts).toLocaleTimeString(),
        }));
        water = water.reverse();
        setWaterStats(water);
      }
    }
  };

  useEffect(() => {
    getStats();
  }, [timeframe]);

  useInterval(() => {
    getStats();
  }, 2000);
  const divStyle =
    "text-center p-4 text-white bg-[#2E2E2E] my-8 rounded-lg lg:w-[1000px] w-[90vw] flex flex-col lg:flex-row justify-center items-center";
  const btnStyle =
    "rounded-lg lg:text-xl md:text-md font-bold text-center py-4 px-8 ";
  return (
    <div
      className="
      flex
      flex-col
      justify-center
      text-white
      items-center
    "
    >
      <h1
        className="
        text-3xl font-bold text-center p-4"
      >
        {t("plants.plantStats")}
      </h1>
      <div
        className="
        flex flex-row justify-center items-center rounded-md cursor-pointer drop-shadow-default m-4 bg-primary-gray max-w-[90vw]
      "
      >
        <h2
          onClick={() => setTimeframe("hour")}
          className={
            btnStyle +
            (timeframe === "hour"
              ? " bg-primary-blue drop-shadow-default rounded-e-none transition-all"
              : "hover:bg-primary-blue rounded-e-none transition-all")
          }
        >
          {t("stats.lastD")}
        </h2>
        <h2
          onClick={() => setTimeframe("week")}
          className={
            btnStyle +
            (timeframe === "week"
              ? "bg-primary-blue rounded-none transition-all"
              : "hover:bg-primary-blue drop-shadow-default rounded-none transition-all")
          }
        >
          {t("stats.lastW")}
        </h2>
        <h2
          onClick={() => setTimeframe("month")}
          className={
            btnStyle +
            (timeframe === "month"
              ? "bg-primary-blue rounded-s-none transition-all"
              : "hover:bg-primary-blue drop-shadow-default rounded-s-none transition-all")
          }
        >
          {t("stats.lastM")}
        </h2>
      </div>
      <div
        className="
        flex
        flex-col
        justify-center
        items-center
        rounded-lg
        p-4
        m-4
        "
      >
        <div>
          <div className={divStyle}>
            <div className="w-full">
              <h2>{t("plants.temperature")}</h2>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={temperatureStats}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis
                    dataKey="uv"
                    padding={{ left: 10, right: 30 }}
                    domain={["auto", "auto"]}
                    tick={{ fontSize: "0.8rem" }}
                    ticks={temperatureStats
                      .map((temp) => temp.uv)
                      .filter((_, index) => index % 5 === 0)}
                  />
                  <YAxis domain={["auto", "auto"]} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "rgba(46, 46, 46, 0.9)",
                      border: "1px solid #e5e5e5",
                    }}
                    formatter={(value: number, name: any) => [
                      `${value.toFixed(1)}°C`,
                      name,
                    ]}
                  />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="pv"
                    stroke="#fff"
                    width={2}
                    activeDot={{ r: 8 }}
                    dot={false} // disable dots on the line
                    isAnimationActive={true} // Optionally, disable animation
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
            <ExtraMetrics stats={temperatureStats} unit={" °C"} />
          </div>

          <div className={divStyle}>
            <div className="w-full">
              <h2>{t("plants.moistureLevel")}</h2>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart width={800} height={300} data={moistureStats}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis
                    dataKey="uv"
                    padding={{ left: 10, right: 30 }}
                    domain={["auto", "auto"]}
                    tick={{ fontSize: "0.8rem" }}
                    ticks={moistureStats
                      .map((moist) => moist.uv)
                      .filter((_, index) => index % 5 === 0)}
                  />
                  <YAxis domain={["auto", "auto"]} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "rgba(46, 46, 46, 0.9)",
                      border: "1px solid #e5e5e5",
                    }}
                    formatter={(value: number, name: any) => [
                      `${value.toFixed(1)}%`,
                      name,
                    ]}
                  />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="pv"
                    stroke="#fff"
                    width={2}
                    activeDot={{ r: 8 }}
                    dot={false} // disable dots on the line
                    isAnimationActive={true} // Optionally, disable animation
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
            <ExtraMetrics stats={moistureStats} unit={" %"} />
          </div>

          <div className={divStyle}>
            <div className="w-full">
              <h2>{t("plants.humidity")}</h2>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart width={800} height={300} data={humidityStats}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis
                    dataKey="uv"
                    padding={{ left: 10, right: 30 }}
                    domain={["auto", "auto"]}
                    tick={{ fontSize: "0.8rem" }}
                    ticks={humidityStats
                      .map((humid) => humid.uv)
                      .filter((_, index) => index % 5 === 0)}
                  />
                  <YAxis domain={["auto", "auto"]} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "rgba(46, 46, 46, 0.9)",
                      border: "1px solid #e5e5e5",
                    }}
                    formatter={(value: number, name: any) => [
                      `${value.toFixed(1)}%`,
                      name,
                    ]}
                  />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="pv"
                    stroke="#fff"
                    width={2}
                    activeDot={{ r: 8 }}
                    dot={false} // disable dots on the line
                    isAnimationActive={true} // Optionally, disable animation
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
            <ExtraMetrics stats={humidityStats} unit={" %"} />
          </div>

          <div className={divStyle}>
            <div className="w-full">
              <h2>{t("plants.lightLevel")}</h2>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart width={800} height={300} data={lightLevelStats}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis
                    dataKey="uv"
                    padding={{ left: 10, right: 30 }}
                    domain={["auto", "auto"]}
                    tick={{ fontSize: "0.8rem" }}
                    ticks={lightLevelStats
                      .map((light) => light.uv)
                      .filter((_, index) => index % 5 === 0)}
                  />
                  <YAxis domain={["auto", "auto"]} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "rgba(46, 46, 46, 0.9)",
                      border: "1px solid #e5e5e5",
                    }}
                    formatter={(value: number, name: any) => [
                      `${value.toFixed(1)}%`,
                      name,
                    ]}
                  />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="pv"
                    stroke="#fff"
                    width={2}
                    activeDot={{ r: 8 }}
                    dot={false} // disable dots on the line
                    isAnimationActive={true} // Optionally, disable animation
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
            <ExtraMetrics stats={lightLevelStats} unit={" Lux"} />
          </div>

          <div className={divStyle}>
            <div className="w-full">
              <h2>{t("plants.waterReservoir")}</h2>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart width={800} height={300} data={waterLevelStats}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis
                    dataKey="uv"
                    padding={{ left: 10, right: 30 }}
                    domain={["auto", "auto"]}
                    tick={{ fontSize: "0.8rem" }}
                    ticks={waterLevelStats
                      .map((water) => water.uv)
                      .filter((_, index) => index % 5 === 0)}
                  />
                  <YAxis domain={["auto", "auto"]} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "rgba(46, 46, 46, 0.9)",
                      border: "1px solid #e5e5e5",
                    }}
                    formatter={(value: number, name: any) => [
                      `${value.toFixed(1)}%`,
                      name,
                    ]}
                  />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="pv"
                    stroke="#fff"
                    width={2}
                    activeDot={{ r: 8 }}
                    dot={false} // disable dots on the line
                    isAnimationActive={true} // Optionally, disable animation
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
            <ExtraMetrics stats={waterLevelStats} unit={" %"} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlantStats;
