import { memo, ReactNode, useCallback, useEffect, useMemo, useRef } from "react";
import { matchPath, useLocation } from "react-router-dom";
import { twMerge } from "tailwind-merge";

import useSelector from "@hooks/useSelector";
import { layoutSidebarsSelector } from "@selectors/commonSelector";
import { getTwScreenWidth } from "@utils/Helpers/commonHelper";

import { LayoutSidebarTypeEnum } from "../constant";

interface LayoutContainerProps {
  children: ReactNode;
  sidebar: ReactNode;
  sidebarIds: string[];
  excludeSidebarPaths?: string[];
}

const LayoutContainer = ({
  children,
  sidebar,
  excludeSidebarPaths = [],
  sidebarIds,
}: LayoutContainerProps) => {
  const sidebars = useSelector(layoutSidebarsSelector(sidebarIds));

  const { pathname } = useLocation();

  const containerRef = useRef<HTMLDivElement>(null);

  const isMatchExcludeSidebarPaths = useMemo(
    () => excludeSidebarPaths.some((path) => matchPath(path, pathname)),
    [pathname, excludeSidebarPaths],
  );
  const calculateMarginLeft = useCallback(() => {
    const windowWidth = window.document.body.clientWidth;
    let marginLeft = 0;

    if (!containerRef.current) {
      return;
    }

    if (windowWidth < getTwScreenWidth("md")) {
      marginLeft = 0;
    } else {
      sidebars.forEach(({ type, isCollapsed }) => {
        if (isCollapsed) {
          if (type === LayoutSidebarTypeEnum.JIRA) {
            marginLeft += 24;
          } else if (type === LayoutSidebarTypeEnum.SEM) {
            marginLeft += 112;
          } else {
            marginLeft += 58;
          }
        } else {
          marginLeft += 290;
        }
      });
    }

    containerRef.current.style.marginLeft = `${marginLeft}px`;
  }, [sidebars]);

  useEffect(() => {
    calculateMarginLeft();

    window.addEventListener("resize", calculateMarginLeft);

    return () => {
      window.removeEventListener("resize", calculateMarginLeft);
    };
  }, [calculateMarginLeft]);

  return (
    <>
      {!isMatchExcludeSidebarPaths && sidebar}
      <div
        className={twMerge("flex flex-col md:min-h-fit-layout", isMatchExcludeSidebarPaths && "md:ml-0")}
        ref={containerRef}
      >
        {children}
      </div>
    </>
  );
};

export default memo(LayoutContainer);
