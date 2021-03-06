import { Component, OnInit } from '@angular/core';
import {
	IGetReportCategory,
	IOrganization,
	IReportCategory,
	ITimeLogFilters,
	PermissionsEnum
} from '@gauzy/models';
import { UntilDestroy } from '@ngneat/until-destroy';
import * as moment from 'moment';
import { ReportService } from '../report.server';

@UntilDestroy()
@Component({
	selector: 'ga-all-report',
	templateUrl: './all-report.component.html',
	styleUrls: ['./all-report.component.scss']
})
export class AllReportComponent implements OnInit {
	PermissionsEnum = PermissionsEnum;
	organization: IOrganization;

	logRequest: ITimeLogFilters = {
		startDate: moment().startOf('week').toDate(),
		endDate: moment().endOf('week').toDate()
	};
	loading: boolean;
	reportCategories: IReportCategory[];

	constructor(private reportService: ReportService) {}

	ngOnInit(): void {
		this.getReportCategories();
	}

	updateShowInMenu($event, report): void {
		this.reportService
			.updateReport(report.id, { showInMenu: $event })
			.then(() => {
				this.reportService.init();
			});
	}

	getReportCategories() {
		const request: IGetReportCategory = {
			relations: ['reports']
		};
		this.loading = true;
		this.reportService
			.getReportCategories(request)
			.then((resp) => {
				this.reportCategories = resp.items;
			})
			.finally(() => {
				this.loading = false;
			});
	}
}
