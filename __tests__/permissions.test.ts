import { can, type Action, type Role } from "@/lib/permissions";

const expected: Record<Action, Record<Role, boolean>> = {
  "deadline:view": { guest: true, user: true, admin: true },
  "deadline:complete": { guest: false, user: true, admin: true },
  "deadline:create": { guest: false, user: false, admin: true },
  "deadline:delete": { guest: false, user: false, admin: true },
};

describe("can(role, action)", () => {
  for (const [action, roles] of Object.entries(expected) as [Action, Record<Role, boolean>][]) {
    for (const [role, allowed] of Object.entries(roles) as [Role, boolean][]) {
      it(`${role} ${allowed ? "được" : "không được"} ${action}`, () => {
        expect(can(role, action)).toBe(allowed);
      });
    }
  }

  it("chưa đăng nhập (undefined/null) được coi là guest", () => {
    expect(can(undefined, "deadline:view")).toBe(true);
    expect(can(null, "deadline:complete")).toBe(false);
  });
});
