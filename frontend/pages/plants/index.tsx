import Head from "next/head";
import Link from "next/link";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { useTranslation } from "next-i18next";
import PlantOverview from "@/components/plant/PlantOverview";
import MediaService2 from "@/services/MediaService";

import { Plant } from "@/types";
import { useEffect, useState } from "react";
import PlantService from "@/services/PlantService";
import { sessionStorageService } from "@/services/sessionStorageService";
import UnauthorizedError from "@/components/auth/UnauthorizedError";
import { Pagination } from "@mui/material";

const Index: React.FC = () => {
  const { t } = useTranslation();
  const [plants, setPlants] = useState<Plant[]>([]);
  const [imagesDict, setImagesDict] = useState<{ [key: string]: string }>({});
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [totalPages, setTotalPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(0);
  const [ascending, setAscending] = useState<boolean>(false);

  const [sortBy, setSortBy] = useState<string>("name");

  useEffect(() => {
    const userDataString = sessionStorageService.isLoggedIn();
    setIsLoggedIn(userDataString as boolean);
  }, []);

  useEffect(() => {
    const fetchPlants = async () => {
      if (isLoggedIn) {
        const response = await PlantService.getAllPlantsPage(
          currentPage
          // ascending,
          // sortBy
        );
        const data = await response.json();
        const { content: plants, totalPages } = data;
        setPlants(plants);
        setTotalPages(totalPages);
      }
    };

    fetchPlants();
  }, [isLoggedIn, currentPage]);

  useEffect(() => {
    const fetchImages = async () => {
      if (isLoggedIn) {
        const fetchedImagesDict: { [key: string]: string } = {};
        const fetchedImagesPromises = plants.map(async (plant) => {
          if (plant.filelink !== "") {
            // Check if filelink is not empty
            const response = await MediaService2.getMediaByPath(plant.filelink);
            const imageBlob = await response.blob();
            const imageUrl = URL.createObjectURL(imageBlob);
            fetchedImagesDict[plant.filelink] = imageUrl;
            return imageUrl;
          } else {
            return null; // Return null for empty filelinks
          }
        });

        const fetchedImages = await Promise.all(fetchedImagesPromises);
        setImagesDict(fetchedImagesDict);
      }
    };

    fetchImages();
  }, [plants, isLoggedIn]);

  return (
    <>
      <main className="py-20">
        {isLoggedIn ? (
          <>
            <PlantOverview
              plants={plants}
              imagesDict={imagesDict}
              setPlants={setPlants}
              setAscending={setAscending}
              ascending={ascending}
              setSortBy={setSortBy}
              sortBy={sortBy}
            />
            {totalPages != 1 && (
              <div className="bg-primary-gray max-w-[250px] flex justify-center drop-shadow-default mt-4 rounded-md p-1 mx-auto">
                <Pagination
                  count={totalPages}
                  page={currentPage + 1}
                  onChange={(event, page) => setCurrentPage(page - 1)}
                  size="large"
                  sx={{
                    "& .MuiPaginationItem-page.Mui-selected": {
                      color: "white", // Change color of selected page
                    },
                    "& .MuiPaginationItem-page": {
                      color: "white", // Change color of unselected pages
                    },
                    "& svg": {
                      fill: "white", // Make SVG icons white
                    },
                    "& .Mui-selected": {
                      bgcolor: "#3B733E", // Change color of the selection circle
                    },
                  }}
                />
              </div>
            )}
          </>
        ) : (
          <UnauthorizedError />
        )}
      </main>
    </>
  );
};

export const getServerSideProps = async (context: { locale: any }) => {
  const { locale } = context;

  return {
    props: {
      ...(await serverSideTranslations(locale ?? "en", ["common"])),
    },
  };
};

export default Index;
