import { Component, OnInit } from '@angular/core';
import { HiveSection } from '../models/hive-section';
import { HiveSectionService } from '../services/hive-section.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-hive-section-form',
  templateUrl: './hive-section-form.component.html',
  styleUrls: ['./hive-section-form.component.css']
})
export class HiveSectionFormComponent implements OnInit {

  hiveSection = new HiveSection(0, "", "", false, "", 0);
  hiveId = 0;
  existed = false;
  

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private sectionService: HiveSectionService
  ) { }

  ngOnInit() {
    this.route.params.subscribe(p => {
      if (p['id'] === undefined) {
        this.hiveSection.hiveId = p['hiveId'];
        return;
      }
      this.existed = true;
      this.sectionService.getHiveSection(p['id']).subscribe(h => this.hiveSection = h);
      this.hiveId = p['hiveId'];
    })
  }

  navigateTo() {
    if (this.hiveId == 0) {
      this.hiveId = this.hiveSection.hiveId;
    }
    this.router.navigate([`/hive/${this.hiveId}/sections`]);
  }

  onCancel() {
    this.navigateTo();
  }

  onSubmit() {
    this.updateSectionRequest.name = this.hiveSection.name;
    this.updateSectionRequest.code = this.hiveSection.code;

    if (this.existed == false) {
      if (this.hiveId == 0) {
        this.hiveId = this.hiveSection.hiveId;
      }
      return this.sectionService.addHiveSection(this.hiveId, this.updateSectionRequest).subscribe(h => this.navigateTo());
    }
    else {
      return this.sectionService.updateHiveSection(this.hiveSection.id, this.updateSectionRequest).subscribe(h => this.navigateTo());
    }
  }

  onDelete() {
    this.sectionService.setHiveSectionStatus(this.hiveSection.id, true).subscribe(h => this.hiveSection.isDeleted = true);
  }

  onUndelete() {
    return this.sectionService.setHiveSectionStatus(this.hiveSection.id, false).subscribe(h => this.hiveSection.isDeleted = false);
  }

  onPurge() {
    this.sectionService.deleteHiveSection(this.hiveSection.id).subscribe(h => this.navigateTo());
  }
}
