import axios, { AxiosError } from "axios";

interface UseLotteryDrawsResult {
  postLotteryDraw: (
    draw: MagnumLotteryDraw
  ) => Promise<{ success: boolean; message: string }>;
  getLotteryDraws: () => Promise<MagnumLotteryDraw[]>;
  getDrawsInRange: (
    startDate: string,
    endDate: string
  ) => Promise<MagnumLotteryDraw[]>;
  calculateAppearances: (lotteryDraws: MagnumLotteryDraw[]) => {
    [key: string]: number;
  };
}

const useMagnumLotteryDraws = (): UseLotteryDrawsResult => {
  const postLotteryDraw = async (draw: MagnumLotteryDraw) => {
    try {
      const response = await axios.post("/api/magnum", draw);
      return { success: true, message: response.data.message };
    } catch (err) {
      const error = err as AxiosError;
      return {
        success: false,
        message: (error.response?.data as any)?.message || "Error",
      };
    }
  };

  const getLotteryDraws = async () => {
    try {
      const response = await axios.get("/api/magnum");
      return response.data as MagnumLotteryDraw[];
    } catch (err) {
      const error = err as AxiosError;
      throw new Error((error.response?.data as any)?.message || "Error");
    }
  };

  const getDrawsInRange = async (startDate: string, endDate: string) => {
    try {
      const response = await axios.get("/api/magnum", {
        params: { startDate, endDate },
      });
      return response.data as MagnumLotteryDraw[];
    } catch (err) {
      const error = err as AxiosError;
      throw new Error((error.response?.data as any)?.message || "Error");
    }
  };

  const calculateAppearances = (lotteryDraws: MagnumLotteryDraw[]) => {
    const countMap: { [key: string]: number } = {};

    lotteryDraws.forEach((draw) => {
      // Increment count for First, Second, and Third Prizes
      countMap[draw.FirstPrize] = (countMap[draw.FirstPrize] || 0) + 1;
      countMap[draw.SecondPrize] = (countMap[draw.SecondPrize] || 0) + 1;
      countMap[draw.ThirdPrize] = (countMap[draw.ThirdPrize] || 0) + 1;

      // Increment count for Special Prizes
      for (let i = 1; i <= 10; i++) {
        const specialKey = `Special${i}` as keyof MagnumLotteryDraw;
        countMap[draw[specialKey]] = (countMap[draw[specialKey]] || 0) + 1;
      }

      // Increment count for Console Prizes
      for (let i = 1; i <= 10; i++) {
        const consoleKey = `Console${i}` as keyof MagnumLotteryDraw;
        countMap[draw[consoleKey]] = (countMap[draw[consoleKey]] || 0) + 1;
      }
    });

    return countMap;
  };

  return {
    postLotteryDraw,
    getLotteryDraws,
    getDrawsInRange,
    calculateAppearances,
  };
};

export default useMagnumLotteryDraws;
