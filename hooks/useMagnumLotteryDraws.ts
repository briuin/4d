import axios, { AxiosError } from 'axios';

interface UseLotteryDrawsResult {
    postLotteryDraw: (draw: MagnumLotteryDraw) => Promise<{ success: boolean; message: string }>;
    getLotteryDraws: () => Promise<MagnumLotteryDraw[]>;
    getDrawsInRange: (startDate: string, endDate: string) => Promise<MagnumLotteryDraw[]>;
  }
  
  const useMagnumLotteryDraws = (): UseLotteryDrawsResult => {
    const postLotteryDraw = async (draw: MagnumLotteryDraw) => {
      try {
        const response = await axios.post('/api/magnum', draw);
        return { success: true, message: response.data.message };
      } catch (err) {
        const error = err as AxiosError;
        return { success: false, message: (error.response?.data as any)?.message || 'Error' };
      }
    };
  
    const getLotteryDraws = async () => {
      try {
        const response = await axios.get('/api/magnum');
        return response.data as MagnumLotteryDraw[];
      } catch (err) {
        const error = err as AxiosError;
        throw new Error((error.response?.data as any)?.message || 'Error');
      }
    };
  
    const getDrawsInRange = async (startDate: string, endDate: string) => {
      try {
        const response = await axios.get('/api/magnum', {
          params: { startDate, endDate },
        });
        return response.data as MagnumLotteryDraw[];
      } catch (err) {
        const error = err as AxiosError;
        throw new Error((error.response?.data as any)?.message || 'Error');
      }
    };
  
    return { postLotteryDraw, getLotteryDraws, getDrawsInRange };
  };
  
  export default useMagnumLotteryDraws;