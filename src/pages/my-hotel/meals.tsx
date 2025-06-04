import React, { useState } from "react";
import { useHotelContext } from "../../contexts/hotelContext";
import { useQueries } from "@tanstack/react-query";
import axios from "axios";
import styles from "./facilities.module.css";
import { MdEdit } from "react-icons/md";
import { FaCheck, FaSort, FaSortUp, FaSortDown } from "react-icons/fa6";
import { RxCross2 } from "react-icons/rx";
import { GiMeal } from "react-icons/gi";

export default function Meals() {
  const hotel = useHotelContext();
  const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });
  const [filterActive, setFilterActive] = useState("all");

  console.log(`- - - Debugging: useHotelContext Data`);
  console.log(hotel.meal_types);

  //  - - - Extract Meals IDs from the hotel context
  const mealsIds = hotel.meal_types || [];

  // - - - useQueries to fetch data for multiple Meals IDs
  const mealsQueries = useQueries({
    queries: mealsIds.map((mealId) => ({
      queryKey: ["meal", mealId], // - - - Unique query key for each Meals
      queryFn: async () => {
        const response = await axios.get(
          `https://hotel.tradesync.software/api/v1/meal-types/${mealId}/`
        );
        return response.data;
      },
      // - - - other useQueries options goes here
    })),
  });

  const isLoading = mealsQueries.some((query) => query.isLoading);

  const isError = mealsQueries.some((query) => query.isError);

  const errors = mealsQueries
    .filter((query) => query.isError)
    .map((query) => query.error);

  // - - -Get all successful data
  const mealsData = mealsQueries
    .filter((query) => query.isSuccess)
    .map((query) => query.data);

  const handleSort = (key) => {
    let direction = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });
  };

  const getSortIcon = (columnKey) => {
    if (sortConfig.key !== columnKey) {
      return <FaSort className="opacity-50" />;
    }
    return sortConfig.direction === "asc" ? <FaSortUp /> : <FaSortDown />;
  };

  const sortedAndFilteredData = React.useMemo(() => {
    let filtered = mealsData;

    // - - - Apply filter
    if (filterActive === "active") {
      filtered = mealsData.filter((f) => f.is_active);
    } else if (filterActive === "inactive") {
      filtered = mealsData.filter((f) => !f.is_active);
    }

    //  - - - Apply sort
    if (sortConfig.key) {
      filtered = [...filtered].sort((a, b) => {
        let aVal = sortConfig.key ? a[sortConfig.key] : null;
        let bVal = sortConfig.key ? b[sortConfig.key] : null;

        if (typeof aVal === "boolean") {
          aVal = aVal ? 1 : 0;
          bVal = bVal ? 1 : 0;
        }

        if (typeof aVal === "string") {
          aVal = aVal.toLowerCase();
          bVal = bVal.toLowerCase();
        }

        if (sortConfig.direction === "asc") {
          return aVal < bVal ? -1 : aVal > bVal ? 1 : 0;
        } else {
          return aVal > bVal ? -1 : aVal < bVal ? 1 : 0;
        }
      });
    }

    return filtered;
  }, [mealsData, sortConfig, filterActive]);

  if (isLoading) {
    console.log("Loading Meal Types...");
    return <p className={styles.loading}>Loading Meal Types...</p>;
  }

  if (isError) {
    console.error("Error fetching Meal Types:", errors);
    return (
      <div className={styles.errorContainer}>
        <p>Error loading Meal Types:</p>
        <ul>
          {errors.map((err, index) => (
            <li key={index}>{err.message}</li>
          ))}
        </ul>
      </div>
    );
  }

  console.log(`- - - Meal Types Response Object`, mealsData);

  return (
    <div className="p-5">
      <div className="flex justify-between items-center mb-4">
        <h2
          className={`font-semibold text-[1.5rem] flex items-center gap-3 ml-[0.5rem]`}
        >
          <GiMeal size={24} /> Meal Types
        </h2>

        <div className="flex items-center gap-3">
          <button className="gap-[6px] bg-[#10b981] text-[#FFF] px-4 py-[6px] rounded-md cursor-pointer hover:bg-[#10b981] transition text-[0.875rem] flex items-cente font-medium">
            <MdEdit size={17} color="#FFF" /> New Meals
          </button>

          <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
            Filter:
            <select
              value={filterActive}
              onChange={(e) => setFilterActive(e.target.value)}
              className="px-3 py-1 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option className="text-red-500" value="all">
                All Meal Types
              </option>
              <option className="text-red-500" value="active">
                Active Only
              </option>
              <option className="text-red-500" value="inactive">
                Inactive Only
              </option>
            </select>
          </label>

          <div className="text-sm text-gray-500">
            Showing {sortedAndFilteredData.length} of {mealsData.length}
            Meals
          </div>
        </div>
      </div>

      <div className={styles.tableContainer}>
        <table className={styles.facilitiesTable}>
          <thead>
            <tr>
              <th>
                <button
                  onClick={() => handleSort("code")}
                  className="flex items-center gap-1 hover:text-gray-800 transition-colors"
                >
                  Code {getSortIcon("code")}
                </button>
              </th>
              <th>
                <button
                  onClick={() => handleSort("name")}
                  className="flex items-center gap-1 hover:text-gray-800 transition-colors"
                >
                  Meal Type{getSortIcon("name")}
                </button>
              </th>
              <th>Description</th>
              <th>
                <button
                  onClick={() => handleSort("is_active")}
                  className="flex items-center gap-1 hover:text-gray-800 transition-colors"
                >
                  Status {getSortIcon("status")}
                </button>
              </th>
              <th>
                <button
                  onClick={() => handleSort("score")}
                  className="flex items-center gap-1 hover:text-gray-800 transition-colors"
                >
                  Meal Score {getSortIcon("score")}
                </button>
              </th>
            </tr>
          </thead>
          <tbody>
            {sortedAndFilteredData.map((meal) => (
              <tr key={meal.id}>
                <td>
                  <span className={styles.tableCode}>{meal.code}</span>
                </td>
                <td>
                  <div className={styles.tableName}>
                    <span>{meal.name}</span>
                  </div>
                </td>
                <td>
                  <div className={styles.tableDescription}>
                    {meal.description}
                  </div>
                </td>
                <td>
                  <div
                    className={`${styles.tableStatus} ${
                      meal.is_active ? styles.active : styles.inactive
                    }`}
                  >
                    {meal.is_active ? (
                      <FaCheck className={styles.activeIcon} />
                    ) : (
                      <RxCross2 className={styles.inactiveIcon} />
                    )}
                  </div>
                </td>
                <td>
                  <span
                    className={`${styles.tableBadge} ${
                      meal.score ? styles.yes : styles.no
                    }`}
                  >
                    {meal.score}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {sortedAndFilteredData.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          No Meal Types found matching your filter criteria.
        </div>
      )}
    </div>
  );
}
