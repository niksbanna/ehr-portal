import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_INTERCEPTOR } from '@nestjs/core';
import configuration from './config/configuration';
import { PrismaModule } from './common/prisma.module';
import { CacheModule } from './common/cache/cache.module';
import { QueueModule } from './common/queue/queue.module';
import { AuditLogInterceptor } from './common/interceptors/audit-log.interceptor';
import { HealthController } from './common/health.controller';
import { AuthModule } from './modules/auth/auth.module';
import { PatientsModule } from './modules/patients/patients.module';
import { EncountersModule } from './modules/encounters/encounters.module';
import { LabsModule } from './modules/labs/labs.module';
import { PrescriptionsModule } from './modules/prescriptions/prescriptions.module';
import { BillingModule } from './modules/billing/billing.module';
import { ReportsModule } from './modules/reports/reports.module';
import { SettingsModule } from './modules/settings/settings.module';
import { AuditModule } from './modules/audit/audit.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
    }),
    PrismaModule,
    CacheModule,
    QueueModule,
    AuthModule,
    PatientsModule,
    EncountersModule,
    LabsModule,
    PrescriptionsModule,
    BillingModule,
    ReportsModule,
    SettingsModule,
    AuditModule,
  ],
  controllers: [HealthController],
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: AuditLogInterceptor,
    },
  ],
})
export class AppModule {}
