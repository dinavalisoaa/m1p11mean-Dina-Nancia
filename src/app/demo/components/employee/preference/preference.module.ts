import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PreferenceComponent } from './preference.component';
import { DataViewModule } from 'primeng/dataview';
import { PickListModule } from 'primeng/picklist';
import { OrderListModule } from 'primeng/orderlist';
import { InputTextModule } from 'primeng/inputtext';
import { DropdownModule } from 'primeng/dropdown';
import { RatingModule } from 'primeng/rating';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { DialogModule } from 'primeng/dialog';
import { MultiSelectModule } from 'primeng/multiselect';
import { BreadcrumbModule } from 'primeng/breadcrumb';
import { MegaMenuModule } from 'primeng/megamenu';
import { MenuModule } from 'primeng/menu';
import { MenubarModule } from 'primeng/menubar';
import { PanelMenuModule } from 'primeng/panelmenu';
import { TabMenuModule } from 'primeng/tabmenu';
import { TieredMenuModule } from 'primeng/tieredmenu';
import { DragDropModule } from 'primeng/dragdrop';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { PreferenceRoutingModule } from './preference-routing.module';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        PreferenceRoutingModule,
        DataViewModule,
        PickListModule,
        OrderListModule,
        DragDropModule,
          RatingModule,
        MenuModule,
        MegaMenuModule,
        PanelMenuModule,
        MenubarModule,
        BreadcrumbModule,
        InputTextModule,
        TieredMenuModule,
        TabMenuModule,
        MultiSelectModule,
        InputTextModule,
        DropdownModule,
        DialogModule,
        RatingModule,
        AutoCompleteModule,
        ButtonModule,
        TableModule,
        DialogModule,
        ConfirmDialogModule
    ],
    declarations: [PreferenceComponent],
    exports:[PreferenceComponent]
})
export class PreferenceModule {}
