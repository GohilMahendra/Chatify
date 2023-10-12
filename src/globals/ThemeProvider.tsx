import React, { createContext , useState , ReactNode} from "react";
import { dark,light,ThemeType  } from "../globals/Themes";

type ThemeContextType = {
  theme: ThemeType;
  setTheme: (theme: ThemeType) => void;
};

type ThemeProps = 
{
    children: ReactNode
}

export const ThemeContext = createContext<ThemeContextType>({
  theme: light, // Default to light theme
  setTheme: () => {},
});

export const ThemeProvider: React.FC <ThemeProps> = ({ children }) => {
  const [theme, setTheme] = useState<ThemeType>(dark);

  const toggleTheme = () => {
    setTheme(theme.mode === 'light' ? dark : light);
  };

  return (
    <ThemeContext.Provider value={{ theme, setTheme: toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};