import React, { useEffect, useRef } from "react";
import { Meta, StoryObj } from "@storybook/react";
import { FloatingArrow } from "@gist-ui/floating-arrow";
import { Button } from "@gist-ui/button";

import * as Popover from "../src";

const meta: Meta = {
  title: "Components/Popover",
};

export default meta;

const Template = () => {
  const ref = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    ref.current?.scrollIntoView({
      behavior: "instant",
      block: "center",
      inline: "center",
    });
  }, []);

  return (
    <div className="w-[300vw] h-[300vh] flex items-center justify-center">
      <Popover.Root>
        <Popover.Trigger>
          <Button ref={ref}>open popver</Button>
        </Popover.Trigger>

        <Popover.Portal>
          <Popover.Content>
            <div className="max-w-sm w-full bg-white border shadow-lg rounded-md p-4">
              <FloatingArrow context={Popover.FloatinArrowContext} />
              <h3 className="text-lg first-letter:uppercase">nice heading</h3>

              <p>
                Lorem ipsum dolor sit amet consectetur adipisicing elit. Nobis aperiam facere,
                molestias eius suscipit in, est distinctio deserunt culpa odit, sunt nostrum. Ad
                culpa excepturi assumenda perferendis similique dolore qui.
              </p>
              <Popover.Close>
                <button>close</button>
              </Popover.Close>
            </div>
          </Popover.Content>
        </Popover.Portal>
      </Popover.Root>
    </div>
  );
};

export const Default: StoryObj = {
  render: Template,
};
