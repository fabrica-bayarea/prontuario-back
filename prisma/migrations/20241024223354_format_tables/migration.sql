-- CreateEnum
CREATE TYPE "Status" AS ENUM ('SCHEDULED', 'COMPLETED', 'CANCELED', 'NO_SHOW');

-- CreateEnum
CREATE TYPE "Gender" AS ENUM ('MALE', 'FEMALE', 'OTHER');

-- CreateEnum
CREATE TYPE "UserType" AS ENUM ('ADMINISTRATOR', 'COLLABORATOR', 'REGISTRAR', 'BENEFICIARY');

-- CreateEnum
CREATE TYPE "Relationship" AS ENUM ('FATHER', 'MOTHER', 'BROTHER', 'SISTER', 'SON', 'DAUGHTER', 'OTHER');

-- CreateTable
CREATE TABLE "AppointmentPeriod" (
    "id" SERIAL NOT NULL,
    "programId" INTEGER NOT NULL,
    "startDate" TIMESTAMP(3) NOT NULL,
    "endDate" TIMESTAMP(3) NOT NULL,
    "startTime" CHAR(5) NOT NULL,
    "endTime" CHAR(5) NOT NULL,
    "daysOfWeek" INTEGER NOT NULL,

    CONSTRAINT "AppointmentPeriod_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Appointment" (
    "id" SERIAL NOT NULL,
    "appointmentPeriodId" INTEGER NOT NULL,
    "beneficiaryId" INTEGER NOT NULL,
    "slotId" INTEGER NOT NULL,
    "status" "Status" NOT NULL DEFAULT 'SCHEDULED',
    "observation" VARCHAR(800),

    CONSTRAINT "Appointment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Slot" (
    "id" SERIAL NOT NULL,
    "collaboratorId" INTEGER NOT NULL,
    "appointmentPeriodId" INTEGER NOT NULL,
    "startDateTime" TIMESTAMP(3) NOT NULL,
    "endDateTime" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Slot_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Course" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(150) NOT NULL,
    "description" VARCHAR(500) NOT NULL,
    "coordinator" VARCHAR(150) NOT NULL,
    "campus" VARCHAR(150) NOT NULL,

    CONSTRAINT "Course_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Program" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(150) NOT NULL,
    "description" VARCHAR(500) NOT NULL,
    "targetAudience" VARCHAR(100) NOT NULL,

    CONSTRAINT "Program_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "firstName" VARCHAR(50) NOT NULL,
    "lastName" VARCHAR(200) NOT NULL,
    "cpf" CHAR(14) NOT NULL,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "cep" CHAR(9) NOT NULL,
    "city" VARCHAR(200) NOT NULL,
    "address" VARCHAR(300) NOT NULL,
    "birthDate" TIMESTAMP(3) NOT NULL,
    "gender" "Gender" NOT NULL,
    "email" VARCHAR(360) NOT NULL,
    "hash" TEXT NOT NULL,
    "phone" CHAR(14) NOT NULL,
    "userType" "UserType" NOT NULL,
    "registration" VARCHAR(15),

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Dependent" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "firstName" VARCHAR(50) NOT NULL,
    "lastName" VARCHAR(200) NOT NULL,
    "cpf" CHAR(14) NOT NULL,
    "birthDate" TIMESTAMP(3) NOT NULL,
    "gender" "Gender" NOT NULL,
    "relationship" "Relationship" NOT NULL,
    "specialNeeds" VARCHAR(500),
    "email" VARCHAR(360) NOT NULL,
    "phone" CHAR(14) NOT NULL,

    CONSTRAINT "Dependent_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_UserCourse" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateTable
CREATE TABLE "_CourseProgram" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateTable
CREATE TABLE "_UserProgram" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "Course_name_key" ON "Course"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Program_name_key" ON "Program"("name");

-- CreateIndex
CREATE UNIQUE INDEX "User_cpf_key" ON "User"("cpf");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Dependent_cpf_key" ON "Dependent"("cpf");

-- CreateIndex
CREATE UNIQUE INDEX "Dependent_email_key" ON "Dependent"("email");

-- CreateIndex
CREATE UNIQUE INDEX "_UserCourse_AB_unique" ON "_UserCourse"("A", "B");

-- CreateIndex
CREATE INDEX "_UserCourse_B_index" ON "_UserCourse"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_CourseProgram_AB_unique" ON "_CourseProgram"("A", "B");

-- CreateIndex
CREATE INDEX "_CourseProgram_B_index" ON "_CourseProgram"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_UserProgram_AB_unique" ON "_UserProgram"("A", "B");

-- CreateIndex
CREATE INDEX "_UserProgram_B_index" ON "_UserProgram"("B");

-- AddForeignKey
ALTER TABLE "AppointmentPeriod" ADD CONSTRAINT "AppointmentPeriod_programId_fkey" FOREIGN KEY ("programId") REFERENCES "Program"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Appointment" ADD CONSTRAINT "Appointment_appointmentPeriodId_fkey" FOREIGN KEY ("appointmentPeriodId") REFERENCES "AppointmentPeriod"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Appointment" ADD CONSTRAINT "Appointment_beneficiaryId_fkey" FOREIGN KEY ("beneficiaryId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Appointment" ADD CONSTRAINT "Appointment_slotId_fkey" FOREIGN KEY ("slotId") REFERENCES "Slot"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Slot" ADD CONSTRAINT "Slot_collaboratorId_fkey" FOREIGN KEY ("collaboratorId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Slot" ADD CONSTRAINT "Slot_appointmentPeriodId_fkey" FOREIGN KEY ("appointmentPeriodId") REFERENCES "AppointmentPeriod"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Dependent" ADD CONSTRAINT "Dependent_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_UserCourse" ADD CONSTRAINT "_UserCourse_A_fkey" FOREIGN KEY ("A") REFERENCES "Course"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_UserCourse" ADD CONSTRAINT "_UserCourse_B_fkey" FOREIGN KEY ("B") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CourseProgram" ADD CONSTRAINT "_CourseProgram_A_fkey" FOREIGN KEY ("A") REFERENCES "Course"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CourseProgram" ADD CONSTRAINT "_CourseProgram_B_fkey" FOREIGN KEY ("B") REFERENCES "Program"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_UserProgram" ADD CONSTRAINT "_UserProgram_A_fkey" FOREIGN KEY ("A") REFERENCES "Program"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_UserProgram" ADD CONSTRAINT "_UserProgram_B_fkey" FOREIGN KEY ("B") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
