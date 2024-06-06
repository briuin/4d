import { NextApiRequest, NextApiResponse } from 'next';
import fs from 'fs';
import path from 'path';
import { parseISO, isWithinInterval } from 'date-fns';

const getFilePath = () => path.join(process.cwd(), 'data', 'magnumLotteryDraws.json');

const readData = (): MagnumLotteryDraw[] => {
  const filePath = getFilePath();
  if (!fs.existsSync(filePath)) {
    return [];
  }
  const jsonData = fs.readFileSync(filePath, 'utf8');
  return JSON.parse(jsonData) as MagnumLotteryDraw[];
};

const writeData = (data: MagnumLotteryDraw[]) => {
  const filePath = getFilePath();
  const directoryPath = path.dirname(filePath);
  if (!fs.existsSync(directoryPath)) {
    fs.mkdirSync(directoryPath, { recursive: true });
  }
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
};

// eslint-disable-next-line import/no-anonymous-default-export
export default (req: NextApiRequest, res: NextApiResponse) => {
  const { method } = req;

  switch (method) {
    case 'GET':
      const { startDate, endDate } = req.query;

      if (startDate && endDate) {
        // Special date range endpoint
        const draws = readData();
        const start = parseISO(startDate as string);
        const end = parseISO(endDate as string);

        const filteredDraws = draws.filter(draw =>
          isWithinInterval(parseISO(draw.DrawDate), { start, end })
        );

        res.status(200).json(filteredDraws);
      } else {
        // Get all data
        const draws = readData();
        res.status(200).json(draws);
      }
      break;
    case 'POST':
      const newDraw = req.body as MagnumLotteryDraw;
      const draws = readData();

      const exists = draws.some(draw => draw.DrawID === newDraw.DrawID);
      if (!exists) {
        draws.push(newDraw);
        writeData(draws);
        res.status(201).json({ message: 'Draw added successfully' });
      } else {
        res.status(409).json({ message: 'Draw already exists' });
      }
      break;
    default:
      res.status(405).json({ message: 'Method not allowed' });
      break;
  }
};
