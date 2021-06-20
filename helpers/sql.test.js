const { sqlForPartialUpdate } = require('./sql');

describe("sqlUpdate", function () {
    const data = {
        firstName: "NewF",
        lastName: "NewF",
        email: "new@email.com",
        isAdmin: true
    }
    const updateInfo = {
        firstName: "first_name",
        lastName: "last_name",
        isAdmin: "is_admin",
      }
    test("Update info", function () {
        const { setCols, values } = sqlForPartialUpdate(data, updateInfo)
        console.log(setCols, values)
        expect(setCols).toEqual(
            `"first_name"=$1, "last_name"=$2, "email"=$3, "is_admin"=$4`
          );
        expect(values).toEqual([ 'NewF', 'NewF', 'new@email.com', true ])
    })
});
  