import asyncio
from sqlalchemy.future import select
from database import async_session
from models.instructor import Instructor

async def check(uid: int):
    async with async_session() as session:
        try:
            result = await session.execute(select(Instructor).where(Instructor.instructor_id == uid))
            instr = result.scalar_one_or_none()
            if instr:
                print("Found Instructor:")
                print("  id:", instr.instructor_id)
                print("  name:", instr.instructor_name)
                print("  email:", instr.email)
                print("  uni_id:", instr.uni_id)
                return
            else:
                print(f"No Instructor row found for instructor_id={uid}")
        except Exception as e:
            print("Error when querying DB:", repr(e))

if __name__ == '__main__':
    import sys
    uid = 2
    if len(sys.argv) > 1:
        try:
            uid = int(sys.argv[1])
        except Exception:
            pass
    asyncio.run(check(uid))
