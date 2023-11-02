import React, { createContext , useState , ReactNode} from "react";
import { dark,light,ThemeType  } from "../globals/Themes";

type ThemeContextType = {
  theme: ThemeType;
  setTheme: () => void;
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
  const [theme, changeTheme] = useState<ThemeType>(dark);

  const toggleTheme = () => {
    changeTheme(theme.mode === 'light' ? dark : light);
  };

  return (
    <ThemeContext.Provider value={{ theme, setTheme: toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};