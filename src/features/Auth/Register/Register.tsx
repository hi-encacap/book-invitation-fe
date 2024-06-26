import { UNPROCESSABLE_ENTITY } from "http-status";
import { memo, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Trans, useTranslation } from "react-i18next";
import { Link, useNavigate, useSearchParams } from "react-router-dom";

import { Alert } from "@components/Alert";
import { Button } from "@components/Button";
import { Checkbox, Input } from "@components/Form";
import { AUTH_CODE } from "@constants/codeConstant";
import { AUTH_PATH } from "@constants/routeConstant";
import useDocumentTitle from "@hooks/useDocumentTitle";
import { AuthFormGeneralError, AuthRegisterFormDataType } from "@interfaces/Common";
import { authService } from "@services/index";
import { setAuthToken } from "@services/Common/authService";

import { registerFormSchema } from "@auth/Schemas/RegisterFormSchema";

import AuthFormContainer from "../Components/AuthFormContainer";
import RegisterFormFooter from "./Components/RegisterFormFooter";

const Register = () => {
  const { t } = useTranslation();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [generalError, setGeneralError] = useState<AuthFormGeneralError | null>(null);
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const {
    control,
    handleSubmit: useFormSubmit,
    setValue,
    watch,
  } = useForm<AuthRegisterFormDataType>({
    resolver: registerFormSchema(t),
  });

  const email = watch("email", "");

  const handleSubmit = useFormSubmit(async (formData) => {
    setIsSubmitting(true);

    await authService
      .register(formData)
      .then((userData) => {
        setAuthToken({ token: userData?.token });
        navigate("/");
      })
      .catch((err) => {
        const { status } = err.response.data;

        if (status === UNPROCESSABLE_ENTITY) {
          setGeneralError({
            code: AUTH_CODE.ACCOUNT_EXISTS,
            message: t("emailAlreadyExists", { email: formData.email }),
          });
          return;
        }
        setGeneralError({ ...err });
      })
      .finally(() => {
        setIsSubmitting(false);
      });
  });

  useDocumentTitle(t("register"));

  useEffect(() => {
    const emailParams = searchParams.get("email");
    if (!emailParams) {
      return;
    }

    setValue("email", emailParams);
  }, [searchParams, setValue]);

  return (
    <AuthFormContainer
      title={t("registerTitle")}
      subtitle={t("registerSubtitle")}
      footer={<RegisterFormFooter />}
    >
      <form className="grid grid-cols-1 gap-6" onSubmit={handleSubmit}>
        {generalError && (
          <Alert title={t("registerError")} message={generalError.message} type="danger" className="mb-2">
            {generalError.code === AUTH_CODE.ACCOUNT_EXISTS && (
              <Link
                to={`${AUTH_PATH.LOGIN}?email=${encodeURIComponent(
                  email ?? "",
                )}&redirect=${encodeURIComponent(searchParams.get("redirect") ?? "")}`}
              >
                {t("loginNow")}
              </Link>
            )}
          </Alert>
        )}

        <Input
          type="text"
          label={t("name")}
          name="name"
          className="block"
          disabled={isSubmitting}
          control={control}
        />
        <Input
          type="text"
          label={t("username")}
          name="username"
          className="block"
          disabled={isSubmitting}
          control={control}
        />
        <Input
          type="text"
          label={t("email")}
          name="email"
          disabled={isSubmitting}
          className="block"
          control={control}
        />
        <Input
          type="password"
          label={t("password")}
          name="password"
          className="block"
          disabled={isSubmitting}
          control={control}
        />
        {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
        <label htmlFor="isAcceptedTerms" className="group hidden items-center justify-start space-x-4">
          <Checkbox
            name="isAcceptedTerms"
            className="flex-shrink-0"
            disabled={isSubmitting}
            control={control}
          />
          <div className="text-sm font-semibold leading-6 text-gray-400">
            <Trans i18nKey="isAcceptedTerm" t={t}>
              0
              <Link to="/" className="ml-1 underline hover:text-black">
                1
              </Link>
            </Trans>
          </div>
        </label>
        <Button type="submit" disabled={isSubmitting} isLoading={isSubmitting}>
          {t("register")}
        </Button>
      </form>
    </AuthFormContainer>
  );
};

export default memo(Register);
