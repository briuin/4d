interface Magnum {
  PastResultsRange: {
    PastResults: MagnumLotteryDraw[];
  }
}

interface MagnumLotteryDraw {
  DrawDate: string;
  DrawID: string;
  DrawDay: string;
  DrawDayZh: string;
  FirstPrize: string;
  SecondPrize: string;
  ThirdPrize: string;
  Special1: string;
  Special2: string;
  Special3: string;
  Special4: string;
  Special5: string;
  Special6: string;
  Special7: string;
  Special8: string;
  Special9: string;
  Special10: string;
  Console1: string;
  Console2: string;
  Console3: string;
  Console4: string;
  Console5: string;
  Console6: string;
  Console7: string;
  Console8: string;
  Console9: string;
  Console10: string;
  Powerball1: string;
  Powerball2: string;
  LifeNum1: string;
  LifeNum2: string;
  LifeNum3: string;
  LifeNum4: string;
  LifeNum5: string;
  LifeNum6: string;
  LifeNum7: string;
  LifeNum8: string;
  LifeBonusNum1: string;
  LifeBonusNum2: string;
  Jackpot1Amount: string;
  Jackpot2Amount: string;
  Jackpot1Winner: string;
  Jackpot2Winner: string;
  GoldJackpot1Amount: string;
  GoldJackpot2Amount: string;
  GoldJackpot1Winner: string;
  GoldJackpot2Winner: string;
  PowerballJackpot1Amount: string;
  PowerballJackpot2Amount: string;
  PowerballJackpot1aWinner: string;
  PowerballJackpot1bWinner: string;
  PowerballJackpot1cWinner: string;
  PowerballJackpot2Winner: string;
  LifePrize1Winner: string;
  LifePrize2Winner: string;
}
