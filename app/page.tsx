"use client";
import useAxios from "@/hooks/useAxios";
import useMagnumLotteryDraws from "@/hooks/useMagnumLotteryDraws";
import { useEffect, useState } from "react";

const LotteryDrawItem: React.FC<{ draw: MagnumLotteryDraw }> = ({ draw }) => {
  const specialPrizes = Object.entries(draw)
    .filter(([key]) => key.startsWith("Special"))
    .sort(([keyA], [keyB]) => keyA.localeCompare(keyB))
    .map(([key, value]) => <div key={key}>{value}</div>);

  const consolePrizes = Object.entries(draw)
    .filter(([key]) => key.startsWith("Console"))
    .sort(([keyA], [keyB]) => keyA.localeCompare(keyB))
    .map(([key, value]) => <div key={key}>{value}</div>);

  return (
    <div className="p-4 border rounded-lg shadow-md">
      <div className="text-lg font-semibold mb-4">
        Draw Date: {draw.DrawDate} ({draw.DrawDayZh})
      </div>
      <div className="flex space-x-4 mb-4">
        <div className="p-2 bg-blue-500 text-white rounded">
          First Prize: {draw.FirstPrize}
        </div>
        <div className="p-2 bg-green-500 text-white rounded">
          Second Prize: {draw.SecondPrize}
        </div>
        <div className="p-2 bg-yellow-500 text-white rounded">
          Third Prize: {draw.ThirdPrize}
        </div>
      </div>
      <div className="flex space-x-4 mb-4 overflow-auto">{specialPrizes}</div>
      <div className="flex space-x-4 overflow-auto">{consolePrizes}</div>
    </div>
  );
};

export default function Home() {
  const [magnums, setMagnums] = useState<MagnumLotteryDraw[]>([]);
  const [date, setDate] = useState<string>("07-06-2024");

  const { request } = useAxios<Magnum>();

  const { postLotteryDraw, getLotteryDraws, getDrawsInRange } =
    useMagnumLotteryDraws();

  const fetchData = async () => {
    const { data, error } = await request(
      `https://app-apdapi-prod-southeastasia-01.azurewebsites.net/results/past/latest-before/${date}/9`
    );
    if (error) {
      return;
    }
    setMagnums(data!.PastResultsRange.PastResults);
  };

  useEffect(() => {
    const fetchLottery = async () => {
      const data = await getLotteryDraws();
      setMagnums(data);
    };

    fetchLottery();
  }, [date]);

  const handleAddData = async () => {
    magnums.forEach(async (x) => {
      const result = await postLotteryDraw(x);
    });
  };

  const previousDays = () => {
    const lastDay = magnums.reduce((last, current) => {
      const currentFormatted = current.DrawDate.split("/").reverse().join("-");
      if (new Date(currentFormatted) < new Date(last)) {
        return currentFormatted;
      }
      return last;
    }, new Date().toDateString());
    setDate(lastDay.replaceAll("/", "-").split("-").reverse().join("-"));
  };

  return (
    <div>
      {magnums.length && (
        <ul>
          {magnums.map((item) => (
            <LotteryDrawItem draw={item} key={item.DrawID}></LotteryDrawItem>
          ))}
        </ul>
      )}
      <button onClick={handleAddData}>Add Data</button>
      <button onClick={previousDays}>Previous Date</button>
    </div>
  );
}
