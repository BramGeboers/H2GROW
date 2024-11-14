import { useTranslation } from "next-i18next";

type Props = {
  stats: any[];
  unit: string;
};
const ExtraMetrics: React.FC<Props> = ({ stats, unit }) => {
  const { t } = useTranslation("common");

  return (
    <div className="flex lg:flex-col flex-row m-4 text-left justify-around w-full lg:w-auto">
      <span>
        {t("stats.average")}:{" "}
        {stats && stats.length > 0
          ? (
              stats.reduce((acc, curr) => acc + curr.pv, 0) / stats.length
            ).toFixed(2)
          : "-"}
        {unit}
      </span>
      <span>
        {t("stats.stDev")}:{" "}
        {stats && stats.length > 0
          ? Math.sqrt(
              stats.reduce(
                (acc, curr) =>
                  acc +
                  Math.pow(
                    curr.pv -
                      stats.reduce((acc, curr) => acc + curr.pv, 0) /
                        stats.length,
                    2
                  ),
                0
              ) / stats.length
            ).toFixed(2)
          : "-"}
        {unit}
      </span>
    </div>
  );
};

export default ExtraMetrics;
