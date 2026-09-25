import { Template } from "aws-cdk-lib/assertions";
import { expect, test } from "vitest";
import { stack } from "./app.ts";

test("the learning stack starts without application resources", () => {
  const template = Template.fromStack(stack).toJSON();

  expect(template.Resources ?? {}).toEqual({});
});
