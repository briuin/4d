import { NextApiRequest, NextApiResponse } from "next";
import fs from "fs";
import path from "path";
import { parseISO, isWithinInterval, format } from "date-fns";
import axios from "axios";
import dayjs from "dayjs";

const getFilePath = () =>
  path.join(process.cwd(), "data", "magnumLotteryDraws.json");

const readData = (): MagnumLotteryDraw[] => {
  const filePath = getFilePath();
  if (!fs.existsSync(filePath)) {
    return [];
  }
  const jsonData = fs.readFileSync(filePath, "utf8");
  return JSON.parse(jsonData) as MagnumLotteryDraw[];
};

const writeData = (data: MagnumLotteryDraw[]) => {
  const filePath = getFilePath();
  const directoryPath = path.dirname(filePath);
  if (!fs.existsSync(directoryPath)) {
    fs.mkdirSync(directoryPath, { recursive: true });
  }
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), "utf8");
};

const fetchData = async (date: string) => {
  try {
    const { data } = await axios.get<Magnum>(
      `https://app-apdapi-prod-southeastasia-01.azurewebsites.net/results/past/latest-before/${date}/9`
    );

    const draws = readData();
    data.PastResultsRange.PastResults.forEach((x) => {
      const exists = draws.some((draw) => draw.DrawID === x.DrawID);
      if (!exists) {
        draws.push(x);
      }
    });
    writeData(draws);
  } catch (e) {}
};

const removeDuplicatesAndSort = (
  lotteryDraws: MagnumLotteryDraw[]
): MagnumLotteryDraw[] => {
  const uniqueDrawsMap = new Map<string, MagnumLotteryDraw>();

  // Add unique items to the map
  lotteryDraws.forEach((draw) => {
    uniqueDrawsMap.set(draw.DrawDate, draw);
  });

  // Convert map values to array and sort by descending date
  return Array.from(uniqueDrawsMap.values()).sort((a, b) => {
    const aFormatted = a.DrawDate.split("/").reverse().join("-");
    const bFormatted = b.DrawDate.split("/").reverse().join("-");
    return new Date(bFormatted).getTime() - new Date(aFormatted).getTime();
  });
};

// eslint-disable-next-line import/no-anonymous-default-export
export default (req: NextApiRequest, res: NextApiResponse) => {
  const { method } = req;

  switch (method) {
    case "GET":
      const { startDate, endDate } = req.query;

      if (startDate && endDate) {
        // Special date range endpoint
        const draws = readData();
        const start = parseISO(startDate as string);
        const end = parseISO(endDate as string);

        const filteredDraws = draws.filter((draw) =>
          isWithinInterval(parseISO(draw.DrawDate), { start, end })
        );

        let currentDateFormatted = (endDate as string)
          .split("-")
          .reverse()
          .join("-");
        const startDateFormatted = (startDate as string)
          .split("-")
          .reverse()
          .join("-");
        if (filteredDraws.length === 0) {
          while (
            new Date(startDateFormatted) < new Date(currentDateFormatted)
          ) {
            const fetchDate = currentDateFormatted
              .split("-")
              .reverse()
              .join("-");
            fetchData(fetchDate);
            currentDateFormatted = dayjs(currentDateFormatted)
              .add(-7, "D")
              .format("YYYY-MM-DD");
          }
        }
        res.status(200).json(filteredDraws);
      } else {
        // Get all data
        const draws = readData();

        // const newDraws = removeDuplicatesAndSort(draws);
        // writeData(newDraws);

        if (draws.length === 0) {
          const dateFormatted = format(
            parseISO(new Date().toISOString()),
            "dd.MM.yyyy"
          );
          fetchData(dateFormatted);
        }
        res.status(200).json(draws);
      }
      break;
    case "POST":
      const newDraw = req.body as MagnumLotteryDraw;
      const draws = readData();

      const exists = draws.some((draw) => draw.DrawID === newDraw.DrawID);
      if (!exists) {
        draws.push(newDraw);
        writeData(draws);
        res.status(201).json({ message: "Draw added successfully" });
      } else {
        res.status(409).json({ message: "Draw already exists" });
      }
      break;
    default:
      res.status(405).json({ message: "Method not allowed" });
      break;
  }
};
