import { forwardRef, useCallback, useEffect, useRef, useState } from "react";
import * as Popper from "@gist-ui/popper";
import { CustomInputElement, Input, InputProps } from "@gist-ui/input";
import { SelectClassNames, SelectVariantProps, select } from "@gist-ui/theme";
import { mergeRefs } from "@gist-ui/react-utils";
import { Button } from "@gist-ui/button";
import { useClickOutside } from "@gist-ui/use-click-outside";
import omit from "lodash.omit";
import pick from "lodash.pick";

const caretDown = (
  <svg
    aria-hidden="true"
    xmlns="http://www.w3.org/2000/svg"
    fill="currentColor"
    viewBox="0 0 16 10"
    style={{
      minWidth: 10,
      minHeight: 10,
    }}
  >
    <path d="M15.434 1.235A2 2 0 0 0 13.586 0H2.414A2 2 0 0 0 1 3.414L6.586 9a2 2 0 0 0 2.828 0L15 3.414a2 2 0 0 0 .434-2.179Z" />
  </svg>
);

export type SelectOption =
  | string
  | {
      label: string;
      value: string;
    };

// const keys: { [key in keyof Popper.FloatingProps]: undefined } = {};

const inputPropsKeys: (keyof InputProps)[] = [
  "a11yFeedback",
  "classNames",
  "color",
  "defaultValue",
  "isDisabled",
  "endContent",
  "error",
  "errorMessage",
  "fullWidth",
  "helperText",
  "hideLabel",
  "id",
  "inputProps",
  "label",
  "labelPlacement",
  "name",
  "onBlur",
  "onChange",
  "onFocus",
  "placeholder",
  "required",
  "rounded",
  "size",
  "startContent",
  "type",
  "value",
  "variant",
];

const variantPropsKeys = select.variantKeys.filter((e) => e !== "rounded");

export interface SelectProps extends Omit<SelectVariantProps, "rounded">, InputProps {
  listboxRounded?: SelectVariantProps["rounded"];
  /**
   * This prop value is use in `listbox` style.maxHeight
   *
   * @default "300px"
   */
  maxHeight?: number;
  listboxClassNames?: SelectClassNames;
  /**
   * @default "no options"
   */
  empltyText?: string;
  options?: SelectOption[];
  /**
   * This prop add distance between `Input` and listbox
   */
  offset?: Popper.FloatingProps["mainOffset"];
}

const Select = forwardRef<CustomInputElement, SelectProps>((_props, ref) => {
  const inputProps = pick(_props, ...inputPropsKeys);
  const variantProps = pick(_props, ...variantPropsKeys);

  const props = omit(_props, ...variantPropsKeys, ...inputPropsKeys);

  const [isOpen, setIsOpen] = useState(false);

  const {
    options,
    listboxClassNames,
    listboxRounded,
    offset,
    maxHeight = 300,
    empltyText = "no options",
  } = props;

  const inputRef = useRef<CustomInputElement>(null);
  const [inputLabel, setInputLabel] = useState<HTMLLabelElement | null>(null);
  const [inputWrapper, setInputWrapper] = useState<HTMLDivElement | null>(null);
  const [listboxRef, setListboxRef] = useState<HTMLDivElement | null>(null);
  const inputFocused = useRef(inputProps.inputProps?.autoFocus || false);

  useClickOutside({
    ref: listboxRef,
    onEvent: "pointerdown",
    callback: (e) => {
      if (inputWrapper?.contains(e.target as Node)) return;
      if (inputLabel?.contains(e.target as Node)) return;
      setIsOpen(false);
    },
  });

  const handleFocus = useCallback(() => {
    inputFocused.current = true;
  }, []);

  const handleBlur = useCallback(() => {
    inputFocused.current = false;
  }, []);

  useEffect(() => {
    const ele = inputRef.current;

    if (!ele) return;

    setInputWrapper(ele.inputWrapper);
    setInputLabel(ele.inputLabel);
  }, []);

  const styles = select({ ...variantProps, rounded: listboxRounded, color: inputProps.color });

  return (
    <>
      <Input
        {...inputProps}
        ref={mergeRefs(ref, inputRef)}
        inputProps={{
          "aria-expanded": false,
          "aria-controls": "",
          "aria-haspopup": "listbox",
          role: "combobox",
          autoComplete: "off",
        }}
        onFocus={handleFocus}
        onBlur={handleBlur}
        endContent={
          <>
            <Button
              isIconOnly
              variant="text"
              size="sm"
              rounded="full"
              aria-label="toggle listbox"
              asChild
              style={{ cursor: "pointer" }}
              onPointerUp={() => {
                setIsOpen((p) => !p);

                if (!inputFocused.current) {
                  inputRef.current?.focus();
                }
              }}
            >
              <div>{caretDown}</div>
            </Button>

            {inputProps.endContent}
          </>
        }
      />

      <Popper.Root>
        <Popper.Reference virturalElement={inputWrapper} />

        {isOpen && (
          <Popper.Floating sticky="always" mainOffset={offset || 5}>
            <div
              ref={setListboxRef}
              className={styles.listbox({ className: listboxClassNames?.listbox })}
              role="listbox"
              aria-activedescendant=""
              aria-roledescription=""
              style={{ maxHeight }}
            >
              {options?.length ? (
                options.map((ele, i) => {
                  return (
                    <div
                      key={i}
                      role="option"
                      aria-checked={false}
                      className={styles.option({ className: listboxClassNames?.option })}
                    >
                      <span>{typeof ele === "string" ? ele : ele.label}</span>
                    </div>
                  );
                })
              ) : (
                <div className={styles.emptyText({ className: listboxClassNames?.emptyText })}>
                  {empltyText}
                </div>
              )}
            </div>
          </Popper.Floating>
        )}
      </Popper.Root>
    </>
  );
});

Select.displayName = "gist-ui.Select";

export default Select;
