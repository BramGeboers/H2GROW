import { useTranslation } from "next-i18next";
import Link from "next/link";

const AdminOnlyError: React.FC = () => {
  const { t } = useTranslation();
  return (
    <div className="flex flex-col items-center justify-center py-20 h-[calc(100vh-88px-236px)] text-2xl">
      <div className="bg-primary-gray p-8 rounded-md shadow-lg flex flex-col items-center">
        <p className="text-red-500">{t("error.adminOnly")}</p>
        <Link href="/">
          <button className="bg-primary-green hover:bg-secondary-green text-white px-4 py-2 rounded-sm drop-shadow-default mt-4">
            {t("general.returnToHome")}
          </button>
        </Link>
      </div>
    </div>
  );
};

export default AdminOnlyError;
