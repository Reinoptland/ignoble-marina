import { useState, useEffect } from "react";

function useIgnobleApi(selectedYear) {
  const [years, setYears] = useState([]);
  const [prizes, setPrizes] = useState([]);

  useEffect(() => {
    async function fetchYears() {
      const response = await fetch("https://ignoble-api.onrender.com/years");
      const data = await response.json();
      setYears(data.years);
    }

    fetchYears();
  }, []);

  useEffect(() => {
    console.log("FETCH BY YEAR EFFECT!", selectedYear);

    const controller = new AbortController();

    async function fetchPrizesByYear() {
      if (selectedYear === null) return;

      try {
        const response = await fetch(
          `https://ignoble-api.onrender.com/years/${selectedYear}/prizes`,
          { signal: controller.signal }
        );
        const data = await response.json();
        console.log("FETCHING???", data.prizes);
        setPrizes(data.prizes);
      } catch (error) {
        console.log(error.name);
        if (error.name === "AbortError") {
          // we can ignore this
        } else {
          console.error(error);
        }
      }
    }

    fetchPrizesByYear();

    return () => {
      // fired before the new effect is executed
      console.log("CLEANUP!");
      controller.abort(); // cancels a request if it has not completed
    };
  }, [selectedYear]);

  return { prizes: prizes, years: years };
}

export default useIgnobleApi;
