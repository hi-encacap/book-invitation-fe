import _ from "lodash";
import { ReactNode, memo, useRef } from "react";
import { Link } from "react-router-dom";

import { Logo } from "@components/Logo";
import { HOME_PATH } from "@constants/routeConstant";
import { commonSelector } from "@selectors/index";

import { useSelector } from "../../../Hooks";
import HeaderUserDropdown from "./HeaderUserDropdown";
import HeaderLoginButton from "./LoginButton";
import LayoutHeaderNavbar from "./Navbar";
import HeaderCard from "./HeaderCart";

interface LayoutHeaderProps {
  prefix?: ReactNode;
}

const LayoutHeader = ({ prefix }: LayoutHeaderProps) => {
  const user = useSelector((state) => state.common.user);
  const statusOrder = useSelector(commonSelector.statusOrderSelector);

  const headerRef = useRef<HTMLDivElement>(null);

  return (
    <div className="sticky top-0 z-50 h-20 w-full bg-white shadow-md" ref={headerRef}>
      <div className="flex h-full w-full justify-between xs:px-4 md:px-8">
        <div className="flex items-center justify-start">
          {prefix}
          <Link to={HOME_PATH.HOME} className="flex h-full flex-shrink-0 items-center">
            <Logo imageClassName="h-full" className="h-10" />
          </Link>
          <LayoutHeaderNavbar />
        </div>
        <div className="flex h-full w-fit items-center space-x-6">
          {_.isEmpty(user) ? (
            <HeaderLoginButton />
          ) : (
            <>
              {Boolean(statusOrder) && <HeaderCard />}
              <HeaderUserDropdown />
            </>
          )}
        </div>
      </div>
    </div>
  );
};
export default memo(LayoutHeader);
