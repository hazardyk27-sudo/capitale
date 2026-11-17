export const MARKETS = [
  "Full Time Result",
  "Double Chance",
  "Draw No Bet",
  "Half Time",
  "Half Time/Full Time",
  "Goals Over/Under 0.5",
  "Goals Over/Under 1.5",
  "Goals Over/Under 2.5",
  "Goals Over/Under 3.5",
  "Goals Over/Under 4.5",
  "Goals Over/Under 5.5",
  "First Half Goals Over/Under 0.5",
  "First Half Goals Over/Under 1.5",
  "First Half Goals Over/Under 2.5",
  "Home Team Score Over/Under",
  "Away Team Score Over/Under",
  "Both Teams to Score",
  "Match Result & Both Teams to Score",
  "Asian Handicap",
  "Asian Handicap (1st Half)",
  "Correct Score",
  "Half Time Correct Score",
  "First Goal Scorer",
  "Anytime Score",
  "To Score 2 or More Goals",
  "Last Goal Scorer",
  "Total Match Corners",
  "Total Match Cards",
  "Clean Sheet",
  "To Win to Nil",
  "Next Goal",
  "Next Goal Scorer",
  "Winning Margin",
  "Full Time Result/Total Goals 1.5",
  "Full Time Result/Total Goals 2.5",
  "Full Time Result/Total Goals 3.5",
  "Full Time Result/Total Goals 4.5",
  "Full Time Result/Total Goals 5.5",
  "Full Time Result/Total Goals 6.5",
  "Double Chance/Total Goals 1.5",
  "Double Chance/Total Goals 2.5",
  "Double Chance/Total Goals 3.5",
  "Double Chance/Total Goals 4.5",
  "Double Chance/Total Goals 5.5",
  "Double Chance/Total Goals 6.5",
];

export const SELECTION_PICKS: Record<string, string[]> = {
  "Full Time Result": ["1", "X", "2"],
  "Double Chance": ["1X", "X2", "12"],
  "Draw No Bet": ["1", "2"],
  "Half Time": ["1", "X", "2"],
  "Half Time/Full Time": [
    "1/1", "1/X", "1/2", "X/1", "X/X", "X/2", "2/1", "2/X", "2/2",
  ],
  "Goals Over/Under 0.5": ["Over 0.5", "Under 0.5"],
  "Goals Over/Under 1.5": ["Over 1.5", "Under 1.5"],
  "Goals Over/Under 2.5": ["Over 2.5", "Under 2.5"],
  "Goals Over/Under 3.5": ["Over 3.5", "Under 3.5"],
  "Goals Over/Under 4.5": ["Over 4.5", "Under 4.5"],
  "Goals Over/Under 5.5": ["Over 5.5", "Under 5.5"],
  "First Half Goals Over/Under 0.5": ["Over 0.5", "Under 0.5"],
  "First Half Goals Over/Under 1.5": ["Over 1.5", "Under 1.5"],
  "First Half Goals Over/Under 2.5": ["Over 2.5", "Under 2.5"],
  "Home Team Score Over/Under": [
    "Over 0.5", "Over 1.5", "Over 2.5", "Over 3.5", "Over 4.5",
    "Under 0.5", "Under 1.5", "Under 2.5", "Under 3.5", "Under 4.5",
  ],
  "Away Team Score Over/Under": [
    "Over 0.5", "Over 1.5", "Over 2.5", "Over 3.5", "Over 4.5",
    "Under 0.5", "Under 1.5", "Under 2.5", "Under 3.5", "Under 4.5",
  ],
  "Both Teams to Score": ["Yes", "No"],
  "Match Result & Both Teams to Score": [
    "1 & Yes", "X & Yes", "2 & Yes", "1 & No", "X & No", "2 & No",
  ],
  "Asian Handicap": [
    "Home -0.5", "Home -1.0", "Home -1.5", "Home -2.0", "Home -2.5", "Home -3.5",
    "Away -0.5", "Away -1.0", "Away -1.5", "Away -2.0", "Away -2.5", "Away -3.5",
    "Home +0.5", "Home +1.0", "Home +1.5", "Home +2.5", "Home +3.5",
    "Away +0.5", "Away +1.0", "Away +1.5", "Away +2.5", "Away +3.5",
  ],
  "Asian Handicap (1st Half)": [
    "Home -0.5", "Away -0.5", "Home +0.5", "Away +0.5",
  ],
  "Correct Score": [
    "1-0", "2-0", "2-1", "3-0", "3-1", "3-2", "4-0", "4-1",
    "0-0", "1-1", "2-2",
    "0-1", "0-2", "1-2", "0-3", "Any Other",
  ],
  "Half Time Correct Score": [
    "0-0", "1-0", "0-1", "1-1", "2-0", "0-2", "2-1", "1-2", "2-2", "Any Other",
  ],
  "Clean Sheet": ["Yes", "No"],
  "To Win to Nil": ["Yes", "No"],
  "Total Match Corners": [
    "Over 7.5", "Under 7.5", "Over 8.5", "Under 8.5",
    "Over 9.5", "Under 9.5", "Over 10.5", "Under 10.5",
    "Over 11.5", "Under 11.5",
  ],
  "Total Match Cards": [
    "Over 1.5", "Under 1.5", "Over 2.5", "Under 2.5",
    "Over 3.5", "Under 3.5", "Over 4.5", "Under 4.5",
  ],
  "Next Goal": ["Home", "No Goal", "Away"],
  "Winning Margin": [
    "Home by 1", "Home by 2", "Home by 3+",
    "Away by 1", "Away by 2", "Away by 3+", "Draw",
  ],
  "Full Time Result/Total Goals 1.5": [
    "Home & Over 1.5", "Draw & Over 1.5", "Away & Over 1.5",
    "Home & Under 1.5", "Draw & Under 1.5", "Away & Under 1.5",
  ],
  "Full Time Result/Total Goals 2.5": [
    "Home & Over 2.5", "Draw & Over 2.5", "Away & Over 2.5",
    "Home & Under 2.5", "Draw & Under 2.5", "Away & Under 2.5",
  ],
  "Full Time Result/Total Goals 3.5": [
    "Home & Over 3.5", "Draw & Over 3.5", "Away & Over 3.5",
    "Home & Under 3.5", "Draw & Under 3.5", "Away & Under 3.5",
  ],
  "Full Time Result/Total Goals 4.5": [
    "Home & Over 4.5", "Draw & Over 4.5", "Away & Over 4.5",
    "Home & Under 4.5", "Draw & Under 4.5", "Away & Under 4.5",
  ],
  "Full Time Result/Total Goals 5.5": [
    "Home & Over 5.5", "Draw & Over 5.5", "Away & Over 5.5",
    "Home & Under 5.5", "Draw & Under 5.5", "Away & Under 5.5",
  ],
  "Full Time Result/Total Goals 6.5": [
    "Home & Over 6.5", "Draw & Over 6.5", "Away & Over 6.5",
    "Home & Under 6.5", "Draw & Under 6.5", "Away & Under 6.5",
  ],
  "Double Chance/Total Goals 1.5": [
    "Home or Draw & Over 1.5", "Home or Away & Over 1.5", "Away or Draw & Over 1.5",
    "Home or Draw & Under 1.5", "Home or Away & Under 1.5", "Away or Draw & Under 1.5",
  ],
  "Double Chance/Total Goals 2.5": [
    "Home or Draw & Over 2.5", "Home or Away & Over 2.5", "Away or Draw & Over 2.5",
    "Home or Draw & Under 2.5", "Home or Away & Under 2.5", "Away or Draw & Under 2.5",
  ],
  "Double Chance/Total Goals 3.5": [
    "Home or Draw & Over 3.5", "Home or Away & Over 3.5", "Away or Draw & Over 3.5",
    "Home or Draw & Under 3.5", "Home or Away & Under 3.5", "Away or Draw & Under 3.5",
  ],
  "Double Chance/Total Goals 4.5": [
    "Home or Draw & Over 4.5", "Home or Away & Over 4.5", "Away or Draw & Over 4.5",
    "Home or Draw & Under 4.5", "Home or Away & Under 4.5", "Away or Draw & Under 4.5",
  ],
  "Double Chance/Total Goals 5.5": [
    "Home or Draw & Over 5.5", "Home or Away & Over 5.5", "Away or Draw & Over 5.5",
    "Home or Draw & Under 5.5", "Home or Away & Under 5.5", "Away or Draw & Under 5.5",
  ],
  "Double Chance/Total Goals 6.5": [
    "Home or Draw & Over 6.5", "Home or Away & Over 6.5", "Away or Draw & Over 6.5",
    "Home or Draw & Under 6.5", "Home or Away & Under 6.5", "Away or Draw & Under 6.5",
  ],
};

export const FALLBACK_PICKS = ["1", "X", "2", "Yes", "No", "Over 2.5", "Under 2.5", "1X", "X2", "12"];

export const KICKOFF_TIMES = [
  "12:00", "13:00", "13:30", "14:00", "14:30", "15:00", "15:30", "16:00", "16:30",
  "17:00", "17:30", "18:00", "18:30", "19:00", "19:30", "19:45", "20:00", "20:30",
  "20:45", "21:00", "21:30", "22:00", "22:30",
];
